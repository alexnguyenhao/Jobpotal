import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Hooks & Actions
import useCV from "@/hooks/useCV";
import { clearCVState } from "@/redux/cvSlice"; // Bỏ comment nếu bạn đã tạo action này

// Components
import ApplicantPreview from "@/components/admin/applicant/ApplicantPreview.jsx";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ApplicantCVView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getCVForRecruiter, loading } = useCV();

  // Lấy state từ Redux
  const cvState = useSelector((state) => state.cv);

  // 1. Gom nhóm dữ liệu (Memoize để tối ưu hiệu năng)
  const cvData = useMemo(
    () => ({
      ...cvState.meta,
      personalInfo: cvState.personalInfo,
      education: cvState.education,
      workExperience: cvState.workExperience,
      skills: cvState.skills,
      certifications: cvState.certifications,
      languages: cvState.languages,
      achievements: cvState.achievements,
      projects: cvState.projects,
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

    // Cleanup: Reset redux khi rời trang này để tránh dính dữ liệu cũ
    return () => {
      dispatch(clearCVState());
    };
  }, [id, dispatch, navigate]);

  // --- RENDER ---

  // Loading State
  if (loading || !cvState?.meta?._id) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#6A38C2]" />
        <p className="text-gray-500 font-medium">Loading Profile...</p>
      </div>
    );
  }

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
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Applicants
            </Button>

            <div className="h-6 w-[1px] bg-gray-300 hidden md:block"></div>

            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">
                {cvData.personalInfo?.fullName || "Applicant Name"}
              </h1>
              <span className="text-xs text-gray-500">
                Applied for: {cvState.meta?.jobTitle || "Job Position"}
              </span>
            </div>
          </div>

          {/* Nếu muốn thêm nút hành động khác (ví dụ: Duyệt/Loại nhanh) thì đặt ở đây */}
          <div className="flex gap-2">
            <Button variant="outline" className="text-red-600">
              Reject
            </Button>
            <Button className="bg-[#6A38C2]">Shortlist</Button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT (PREVIEW) --- */}
      <div className="flex justify-center mt-8 px-4">
        {/* Giữ chiều rộng tương đương A4 (khoảng 210mm ~ 800px) 
            để đảm bảo CV hiển thị đúng như lúc ứng viên thiết kế 
        */}
        <div className="w-full max-w-[210mm] bg-white shadow-xl rounded-sm min-h-[297mm]">
          <ApplicantPreview cvData={cvData} />
        </div>
      </div>
    </div>
  );
};

export default ApplicantCVView;
