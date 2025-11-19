import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

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
      cvData.workExperience.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4">
      {cvData.workExperience.map((item, i) => (
        <div
          key={i}
          className="p-4 border rounded-lg bg-gray-50/50 space-y-3 group relative"
        >
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Position"
              className="font-medium"
              value={item.position}
              onChange={(e) => handleEdit(i, "position", e.target.value)}
            />
            <Input
              placeholder="Company"
              value={item.company}
              onChange={(e) => handleEdit(i, "company", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input
              type="text"
              placeholder="Start Date"
              value={item.startDate}
              onChange={(e) => handleEdit(i, "startDate", e.target.value)}
            />
            <Input
              type="text"
              placeholder="End Date"
              value={item.endDate}
              onChange={(e) => handleEdit(i, "endDate", e.target.value)}
            />
          </div>

          <Textarea
            rows={3}
            placeholder="Job Description..."
            className="bg-white text-sm"
            value={item.description}
            onChange={(e) => handleEdit(i, "description", e.target.value)}
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(i)}
            className="absolute -top-2 -right-2 h-6 w-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={12} />
          </Button>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={handleAdd}
        className="w-full border-dashed text-[#6A38C2] border-[#6A38C2]/30 hover:bg-[#6A38C2]/5"
      >
        <Plus size={14} className="mr-2" /> Add Experience
      </Button>
    </div>
  );
};

export default ExperienceSection;
