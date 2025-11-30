import { Textarea } from "@/components/ui/textarea";

const InterestsSection = ({ cvData, updateField }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3">Interests</h3>
      <Textarea
        rows={3}
        value={cvData.interests}
        onChange={(e) => updateField("interests", e.target.value)}
        placeholder="Your interests..."
      />
    </div>
  );
};
export default InterestsSection;
