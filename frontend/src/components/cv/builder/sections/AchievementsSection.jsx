import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AchievementsSection = ({ cvData, updateField }) => {
  const edit = (index, key, val) => {
    const cloned = cvData.achievements.map((a) => structuredClone(a));
    cloned[index][key] = val;
    updateField("achievements", cloned);
  };

  const add = () => {
    updateField("achievements", [
      ...cvData.achievements.map((a) => structuredClone(a)),
      { title: "", description: "", year: "" },
    ]);
  };

  const remove = (index) => {
    updateField(
      "achievements",
      cvData.achievements
        .filter((_, i) => i !== index)
        .map((a) => structuredClone(a))
    );
  };

  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold mb-3">Achievements</h3>

      {cvData.achievements.map((a, i) => (
        <div key={i} className="mb-4 p-3 border rounded-lg bg-gray-50">
          <Input
            className="mb-2"
            placeholder="Title"
            value={a.title}
            onChange={(e) => edit(i, "title", e.target.value)}
          />

          <Textarea
            rows={3}
            placeholder="Description"
            value={a.description}
            onChange={(e) => edit(i, "description", e.target.value)}
          />

          <Input
            className="mt-2"
            placeholder="Year"
            value={a.year}
            onChange={(e) => edit(i, "year", e.target.value)}
          />

          <button
            className="text-red-600 text-sm mt-2"
            onClick={() => remove(i)}
          >
            Delete
          </button>
        </div>
      ))}

      <button className="text-[#6A38C2]" onClick={add}>
        + Add Achievement
      </button>
    </div>
  );
};

export default AchievementsSection;
