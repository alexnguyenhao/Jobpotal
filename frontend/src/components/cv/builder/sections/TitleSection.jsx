import { Textarea } from "@/components/ui/textarea";

const TitleSection = ({ cvData, updateField }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3">Title</h3>

      <Textarea
        rows={3}
        value={cvData.title}
        onChange={(e) => updateField("title", e.target.value)}
        placeholder="Your professional title..."
      />
    </div>
  );
};

export default TitleSection;
