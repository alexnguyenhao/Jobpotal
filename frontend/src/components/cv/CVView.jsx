import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useCV from "@/hooks/useCV";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Download } from "lucide-react";
import LivePreview from "@/components/cv/builder/LivePreview";
import PDFExport from "@/components/common/PDFExport";

const CVView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCV, shareCV } = useCV();

  const { meta, ...cvSections } = useSelector((state) => state.cv);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await getCV(id); // Hàm này đã update setFullCV trong hook
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading || !meta?._id) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-500">
        Loading CV...
      </div>
    );
  }

  // Gom dữ liệu
  const cvData = {
    ...meta,
    ...cvSections,
  };

  const handleShare = async () => {
    const url = await shareCV(cvData._id);
    if (url) {
      navigator.clipboard.writeText(url);
      alert("Public link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-6xl mx-auto">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} className="mr-2" /> Back
        </Button>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleShare}>
            <Share2 size={18} className="mr-1" /> Share
          </Button>

          {/* Logic nút Download/Export tùy theo loại */}
          {cvData.type === "builder" ? (
            <PDFExport targetId="cv-print-area" filename={cvData.title} />
          ) : (
            <Button onClick={() => window.open(cvData.fileData?.url, "_blank")}>
              <Download size={18} className="mr-1" /> Download PDF
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        {/* RENDER DỰA TRÊN TYPE */}
        {cvData.type === "upload" ? (
          // === VIEW CHO UPLOADED PDF ===
          <div className="w-full max-w-5xl h-[85vh] bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            {cvData.fileData?.url ? (
              <iframe
                src={`${cvData.fileData.url}#toolbar=0`}
                className="w-full h-full"
                title="CV Preview"
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-red-500">
                File not found.
              </div>
            )}
          </div>
        ) : (
          // === VIEW CHO BUILDER TEMPLATE ===
          <div className="shadow-2xl">
            <LivePreview cvData={cvData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CVView;
