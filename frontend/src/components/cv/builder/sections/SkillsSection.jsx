import { Textarea } from "@/components/ui/textarea";

const SkillsSection = ({ cvData, updateField }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3">Skills</h3>

      <Textarea
        rows={3}
        value={cvData.skills.join(", ")}
        onChange={(e) =>
          updateField("skills", [
            ...e.target.value.split(",").map((s) => s.trim()),
          ])
        }
        placeholder="React, Tailwind, Node.js..."
      />
    </div>
  );
};

export default SkillsSection;
