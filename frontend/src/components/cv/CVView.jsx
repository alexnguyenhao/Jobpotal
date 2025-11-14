import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useCV from "@/hooks/useCV";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";

import html2pdf from "html2pdf.js";
import LivePreview from "@/components/cv/builder/LivePreview";

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

  // Gộp lại thành cvData chuẩn
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
    styleConfig,
  };

  // DOWNLOAD PDF
  const handleDownload = () => {
    const element = document.getElementById("cv-print-area");

    const opt = {
      margin: 0,
      filename: `${cvData.title || "my-cv"}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  // SHARE CV
  const handleShare = async () => {
    const url = await shareCV(cvData._id);
    if (url) {
      navigator.clipboard.writeText(url);
      alert("Đã copy link chia sẻ!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* HEADER ACTIONS */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} className="mr-2" /> Quay lại
        </Button>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleShare}>
            <Share2 size={18} className="mr-1" /> Chia sẻ
          </Button>

          <Button className="bg-[#6A38C2] text-white" onClick={handleDownload}>
            <Download size={18} className="mr-1" /> Tải PDF
          </Button>
        </div>
      </div>

      {/* CV TITLE */}
      <h1 className="text-3xl font-bold mb-4">{cvData.title}</h1>

      {/* PREVIEW A4 */}
      <div className="flex justify-center">
        <LivePreview cvData={cvData} />
      </div>
    </div>
  );
};

export default CVView;
