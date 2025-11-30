import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useCV from "@/hooks/useCV";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";

import LivePreview from "@/components/cv/builder/LivePreview";
import PDFExport from "@/components/common/PDFExport";

const CVView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCV, shareCV } = useCV();

  const {
    meta,
    personalInfo,
    education,
    workExperience,
    skills,
    certifications,
    languages,
    achievements,
    projects,
    operations,
    interests,
    styleConfig,
  } = useSelector((state) => state.cv);

  const [loading, setLoading] = useState(true);

  // LOAD CV
  useEffect(() => {
    const load = async () => {
      await getCV(id);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading || !meta._id) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-500">
        Đang tải CV...
      </div>
    );
  }

  const cvData = {
    _id: meta._id,
    title: meta.title,
    template: meta.template,
    isPublic: meta.isPublic,
    shareUrl: meta.shareUrl,
    createdAt: meta.createdAt,
    updatedAt: meta.updatedAt,
    user: meta.user,
    personalInfo,
    education,
    workExperience,
    skills,
    certifications,
    languages,
    achievements,
    projects,
    operations,
    interests,
    styleConfig,
  };

  const handleShare = async () => {
    const url = await shareCV(cvData._id);
    if (url) {
      navigator.clipboard.writeText(url);
      alert("Đã copy link chia sẻ!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} className="mr-2" /> Quay lại
        </Button>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleShare}>
            <Share2 size={18} className="mr-1" /> Chia sẻ
          </Button>

          <PDFExport targetId="cv-print-area" filename={cvData.title} />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-4">{cvData.title}</h1>
      <div className="flex justify-center">
        <LivePreview cvData={cvData} />
      </div>
    </div>
  );
};

export default CVView;
