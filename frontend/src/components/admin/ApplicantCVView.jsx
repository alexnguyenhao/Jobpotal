import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useCV from "@/hooks/useCV";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import ApplicantPreview from "@/components/admin/ApplicantPreview";

const ApplicantCVView = () => {
  const { id } = useParams();
  const { getCVForRecruiter, loading } = useCV();

  const {
    personalInfo,
    education,
    workExperience,
    skills,
    certifications,
    languages,
    achievements,
    projects,
    styleConfig,
    meta,
  } = useSelector((state) => state.cv);

  const cvData = {
    ...meta,
    personalInfo,
    education,
    workExperience,
    skills,
    certifications,
    languages,
    achievements,
    projects,
    styleConfig,
  };

  useEffect(() => {
    getCVForRecruiter(id);
  }, [id]);

  if (loading || !meta?._id) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#6A38C2]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-6 text-[#6A38C2]">
          Applicant CV
        </h1>

        <ApplicantPreview cvData={cvData} />
      </div>
    </div>
  );
};

export default ApplicantCVView;
