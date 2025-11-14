import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const EducationSection = ({ cvData, updateField }) => {
  const handleEdit = (index, key, val) => {
    const cloned = cvData.education.map((item) => structuredClone(item));
    cloned[index][key] = val;
    updateField("education", cloned);
  };

  const handleAdd = () => {
    updateField("education", [
      ...cvData.education.map((i) => structuredClone(i)),
      {
        school: "",
        degree: "",
        major: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const handleDelete = (index) => {
    updateField(
      "education",
      cvData.education
        .filter((_, i) => i !== index)
        .map((i) => structuredClone(i))
    );
  };

  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold mb-3">Education</h3>

      {cvData.education.map((item, i) => (
        <div key={i} className="mb-4 p-3 border rounded-lg bg-gray-50">
          <Input
            className="mb-2"
            placeholder="School"
            value={item.school}
            onChange={(e) => handleEdit(i, "school", e.target.value)}
          />

          <Input
            className="mb-2"
            placeholder="Degree"
            value={item.degree}
            onChange={(e) => handleEdit(i, "degree", e.target.value)}
          />

          <Input
            className="mb-2"
            placeholder="Major"
            value={item.major}
            onChange={(e) => handleEdit(i, "major", e.target.value)}
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
        + Add Education
      </button>
    </div>
  );
};

export default EducationSection;
