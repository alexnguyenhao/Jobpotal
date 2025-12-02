import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Hooks & Actions
import useCV from "@/hooks/useCV";
import { clearCVState } from "@/redux/cvSlice";

// Components
import ApplicantPreview from "@/components/admin/applicant/ApplicantPreview.jsx";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

const ApplicantCVView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getCVForRecruiter, loading } = useCV();

  const cvState = useSelector((state) => state.cv);

  // 1. Merge Data từ Redux
  const cvData = useMemo(
    () => ({
      ...cvState.meta, // Bao gồm _id, title, resume, resumeOriginalName
      personalInfo: cvState.personalInfo,
      education: cvState.education,
      workExperience: cvState.workExperience,
      skills: cvState.skills,
      certifications: cvState.certifications,
      languages: cvState.languages,
      achievements: cvState.achievements,
      projects: cvState.projects,
      operations: cvState.operations,
      interests: cvState.interests,
      styleConfig: cvState.styleConfig,
    }),
    [cvState]
  );

  // 2. Fetch Data
  useEffect(() => {
    if (id) {
      getCVForRecruiter(id).catch(() => {
        toast.error("Failed to load CV");
        navigate(-1);
      });
    }

    return () => {
      dispatch(clearCVState());
    };
  }, [id, dispatch, navigate]); // Bỏ getCVForRecruiter khỏi dependency để tránh loop

  // 3. Loading State
  if (loading || !cvState?.meta?._id) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#6A38C2]" />
        <p className="text-gray-500 font-medium">Loading Profile...</p>
      </div>
    );
  }

  // 4. Kiểm tra loại CV (Nếu có link resume -> Là Uploaded PDF)
  const isPdf = !!cvData.resume;

  return (
    <div className="min-h-screen bg-gray-100/80 pb-20">
      {/* --- HEADER BAR --- */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-[#6A38C2] hover:bg-purple-50"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <div className="h-6 w-[1px] bg-gray-300 hidden md:block"></div>

            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">
                {cvData.personalInfo?.fullName || "Applicant Name"}
              </h1>
              <span className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                {isPdf ? (
                  <>
                    <FileText size={12} className="text-red-500" />
                    PDF File:{" "}
                    <span className="font-medium">
                      {cvData.resumeOriginalName}
                    </span>
                  </>
                ) : (
                  `Template: ${cvData.template || "Standard"}`
                )}
              </span>
            </div>
          </div>

          {/* Action Buttons (Chỉ hiện cho PDF hoặc khi cần thiết) */}
          {isPdf && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => window.open(cvData.resume, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" /> Open in New Tab
              </Button>
              <Button
                size="sm"
                className="bg-[#6A38C2] hover:bg-[#5a2ea6] h-9"
                onClick={() => {
                  // Tải file
                  const link = document.createElement("a");
                  link.href = cvData.resume;
                  link.target = "_blank";
                  link.download = cvData.resumeOriginalName || "resume.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex justify-center mt-8 px-4">
        {isPdf ? (
          // --- CASE 1: PDF VIEWER ---
          <div className="w-full max-w-6xl h-[85vh] bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <iframe
              src={`${cvData.resume}#toolbar=0`}
              className="w-full h-full"
              title="Resume PDF"
            />
          </div>
        ) : (
          // --- CASE 2: BUILDER PREVIEW ---
          <div className="w-full max-w-[210mm] bg-white shadow-xl rounded-sm min-h-[297mm]">
            <ApplicantPreview cvData={cvData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantCVView;
