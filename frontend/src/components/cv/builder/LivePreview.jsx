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
        <div
          id="cv-print-area"
          className="bg-white"
          style={{
            width: "794px",
            minHeight: "1123px",
            overflow: "visible",
            padding: "24px",
          }}
        >
          <SelectedTemplate data={cvData} />
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
