import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const PDFExport = ({ targetId, filename = "document" }) => {
  const [loading, setLoading] = useState(false);

  const exportPDF = async () => {
    const element = document.getElementById(targetId);
    if (!element) {
      console.error("❌ no element found with id:", targetId);
      return;
    }

    setLoading(true);

    try {
      const dataUrl = await toPng(element, {
        pixelRatio: 3,
        quality: 1,
      });

      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error);
    }

    setLoading(false);
  };

  return (
    <Button
      className="bg-[#6A38C2] text-white"
      onClick={exportPDF}
      disabled={loading}
    >
      {loading ? (
        "Exporting..."
      ) : (
        <>
          <Download size={18} /> Export PDF
        </>
      )}
    </Button>
  );
};

export default PDFExport;
