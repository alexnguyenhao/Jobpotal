import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const AchievementsSection = ({ cvData, updateField }) => {
  const edit = (index, key, val) => {
    const cloned = cvData.achievements.map((a) => structuredClone(a));
    cloned[index][key] = val;
    updateField("achievements", cloned);
  };

  const add = () => {
    updateField("achievements", [
      ...cvData.achievements.map((a) => structuredClone(a)),
      { title: "", description: "", date: "" },
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
          <div className="mb-2">
            <Label className="text-xs text-gray-500">Title</Label>
            <Input
              placeholder="Title"
              value={a.title}
              onChange={(e) => edit(i, "title", e.target.value)}
            />
          </div>

          <div className="mb-2">
            <Label className="text-xs text-gray-500">Description</Label>
            <Textarea
              rows={3}
              placeholder="Description"
              value={a.description}
              onChange={(e) => edit(i, "description", e.target.value)}
            />
          </div>

          <div>
            <Label className="text-xs text-gray-500">Date</Label>
            <Input
              type="date"
              value={a.date ? a.date.split("T")[0] : ""}
              onChange={(e) => edit(i, "date", e.target.value)}
            />
          </div>

          <button
            className="text-red-600 text-sm mt-2"
            onClick={() => remove(i)}
          >
            Delete
          </button>
        </div>
      ))}

      <button className="text-[#6A38C2] font-medium" onClick={add}>
        + Add Achievement
      </button>
    </div>
  );
};

export default AchievementsSection;
