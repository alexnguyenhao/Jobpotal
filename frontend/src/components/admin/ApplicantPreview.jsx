import ModernTemplate from "@/components/cv/templates/ModernTemplate";
import ClassicTemplate from "@/components/cv/templates/ClassicTemplate";
import CreativeTemplate from "@/components/cv/templates/CreativeTemplate";

const TEMPLATE_MAP = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  creative: CreativeTemplate,
};

const ApplicantPreview = ({ cvData }) => {
  if (!cvData) return null;

  const SelectedTemplate = TEMPLATE_MAP[cvData.template] || ModernTemplate;

  return (
    <div className="flex justify-center bg-gray-100 p-6">
      <div
        style={{
          width: "794px",
          minHeight: "1123px",
          padding: "24px",
          background: "white",
        }}
      >
        <SelectedTemplate data={cvData} />
      </div>
    </div>
  );
};

export default ApplicantPreview;
