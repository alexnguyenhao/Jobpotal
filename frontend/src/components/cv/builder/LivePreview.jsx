import ModernTemplate from "../templates/ModernTemplate";
import ClassicTemplate from "../templates/ClassicTemplate";
import CreativeTemplate from "../templates/CreativeTemplate";

const LivePreview = ({ cvData }) => {
  const renderTemplate = () => {
    switch (cvData.template) {
      case "classic":
        return <ClassicTemplate data={cvData} />;
      case "creative":
        return <CreativeTemplate data={cvData} />;
      default:
        return <ModernTemplate data={cvData} />;
    }
  };

  return (
    <div className="flex-1 bg-gray-100 overflow-auto p-6 flex justify-center">
      <div
        className="bg-white shadow-xl p-10 rounded-lg"
        style={{
          width: "794px", // A4 width px
          minHeight: "1123px", // A4 height px
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};

export default LivePreview;
