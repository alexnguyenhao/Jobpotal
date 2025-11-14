import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ExperienceSection = ({ cvData, updateField }) => {
  const handleEdit = (index, key, val) => {
    const cloned = cvData.workExperience.map((item) => structuredClone(item));
    cloned[index][key] = val;
    updateField("workExperience", cloned);
  };

  const handleAdd = () => {
    updateField("workExperience", [
      ...cvData.workExperience.map((i) => structuredClone(i)),
      {
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const handleDelete = (index) => {
    updateField(
      "workExperience",
      cvData.workExperience
        .filter((_, i) => i !== index)
        .map((i) => structuredClone(i))
    );
  };

  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold mb-3">Work Experience</h3>

      {cvData.workExperience.map((item, i) => (
        <div key={i} className="mb-4 p-3 border rounded-lg bg-gray-50">
          <Input
            className="mb-2"
            placeholder="Position"
            value={item.position}
            onChange={(e) => handleEdit(i, "position", e.target.value)}
          />

          <Input
            className="mb-2"
            placeholder="Company"
            value={item.company}
            onChange={(e) => handleEdit(i, "company", e.target.value)}
          />

          <div className="flex gap-2">
            <Input
              placeholder="Start"
              value={item.startDate}
              onChange={(e) => handleEdit(i, "startDate", e.target.value)}
            />
            <Input
              placeholder="End"
              value={item.endDate}
              onChange={(e) => handleEdit(i, "endDate", e.target.value)}
            />
          </div>

          <Textarea
            rows={3}
            className="mt-2"
            placeholder="Description"
            value={item.description}
            onChange={(e) => handleEdit(i, "description", e.target.value)}
          />

          <button
            onClick={() => handleDelete(i)}
            className="text-red-600 text-sm mt-2"
          >
            Delete
          </button>
        </div>
      ))}

      <button onClick={handleAdd} className="text-[#6A38C2] font-medium mt-2">
        + Add Experience
      </button>
    </div>
  );
};

export default ExperienceSection;
