import { Textarea } from "@/components/ui/textarea";

const SummarySection = ({ cvData, updateField }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3">Summary</h3>

      <Textarea
        rows={5}
        value={cvData.personalInfo.summary}
        onChange={(e) => updateField("personalInfo.summary", e.target.value)}
        placeholder="Write a strong professional summary..."
      />
    </div>
  );
};

export default SummarySection;
