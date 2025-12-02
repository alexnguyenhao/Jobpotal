import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Briefcase } from "lucide-react";

const ExperienceSection = ({ cvData, updateField }) => {
  const handleEdit = (index, key, val) => {
    const cloned = cvData.workExperience.map((item) => ({ ...item }));
    cloned[index][key] = val;
    updateField("workExperience", cloned);
  };

  const handleAdd = () => {
    updateField("workExperience", [
      ...cvData.workExperience,
      {
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
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

  const togglePresent = (index, isChecked) => {
    const cloned = cvData.workExperience.map((item) => ({ ...item }));
    cloned[index].isCurrent = isChecked;
    if (isChecked) {
      cloned[index].endDate = ""; // Reset end date nếu đang làm việc
    }
    updateField("workExperience", cloned);
  };

  return (
    <div className="space-y-6">
      {cvData.workExperience.map((item, i) => (
        <div
          key={i}
          className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm space-y-4 relative group hover:border-[#6A38C2]/50 transition-colors"
        >
          {/* Header & Delete */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#6A38C2]">
              <Briefcase size={18} />
              <span className="font-semibold text-sm">Experience #{i + 1}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(i)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Position</Label>
              <Input
                placeholder="e.g. Software Engineer"
                value={item.position}
                onChange={(e) => handleEdit(i, "position", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Company</Label>
              <Input
                placeholder="e.g. Google"
                value={item.company}
                onChange={(e) => handleEdit(i, "company", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Start Date</Label>
              <Input
                type="date"
                value={item.startDate ? item.startDate.split("T")[0] : ""}
                onChange={(e) => handleEdit(i, "startDate", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <Label className="text-xs text-gray-500">End Date</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`exp-present-${i}`}
                    checked={item.isCurrent}
                    onChange={(e) => togglePresent(i, e.target.checked)}
                    className="w-3 h-3 text-[#6A38C2] rounded border-gray-300 focus:ring-[#6A38C2]"
                  />
                  <Label
                    htmlFor={`exp-present-${i}`}
                    className="text-xs cursor-pointer text-gray-600 select-none"
                  >
                    Current
                  </Label>
                </div>
              </div>
              <Input
                type="date"
                disabled={item.isCurrent}
                value={
                  item.endDate && !item.isCurrent
                    ? item.endDate.split("T")[0]
                    : ""
                }
                onChange={(e) => handleEdit(i, "endDate", e.target.value)}
                className={item.isCurrent ? "bg-gray-100" : ""}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Description</Label>
            <Textarea
              rows={3}
              placeholder="Describe your responsibilities and achievements..."
              value={item.description}
              onChange={(e) => handleEdit(i, "description", e.target.value)}
            />
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={handleAdd}
        className="w-full border-dashed border-2 py-6 text-[#6A38C2] border-[#6A38C2]/20 hover:bg-[#6A38C2]/5 hover:border-[#6A38C2]"
      >
        <Plus size={16} className="mr-2" /> Add Experience
      </Button>
    </div>
  );
};

export default ExperienceSection;
