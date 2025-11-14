import ModernTemplate from "@/components/cv/templates/ModernTemplate";
import ClassicTemplate from "@/components/cv/templates/ClassicTemplate";
import CreativeTemplate from "@/components/cv/templates/CreativeTemplate";

const TEMPLATE_MAP = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  creative: CreativeTemplate,
};

const LivePreview = ({ cvData }) => {
  if (!cvData) return null;

  const SelectedTemplate = TEMPLATE_MAP[cvData.template] || ModernTemplate;

  return (
    <div className="flex-1 overflow-auto bg-gray-100 p-10">
      <div className="flex justify-center">
        {/* Vùng này sẽ được export PDF */}
        <div
          id="cv-print-area"
          className="bg-white"
          style={{
            width: "860px", // A4 width
            minHeight: "1216px", // A4 height
            overflow: "hidden", // tránh rò layout khi xuất PDF
          }}
        >
          <SelectedTemplate data={cvData} />
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
