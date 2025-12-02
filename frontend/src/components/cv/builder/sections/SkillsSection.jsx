import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, GripVertical, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SkillsSection = ({ cvData, updateField }) => {
  const update = (index, key, val) => {
    const cloned = cvData.skills.map((s) => ({ ...s }));
    cloned[index][key] = val;
    updateField("skills", cloned);
  };

  const add = () => {
    updateField("skills", [
      ...cvData.skills,
      { name: "", level: "Intermediate" },
    ]);
  };

  const remove = (index) => {
    updateField(
      "skills",
      cvData.skills.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
          <span className="text-xs text-gray-400 font-medium px-2 py-1 bg-gray-100 rounded-full">
            {cvData.skills.length} Items
          </span>
        </div>

        {/* Nút Add nằm trên Header */}
        <Button
          variant="ghost"
          size="sm"
          onClick={add}
          className="text-[#6A38C2] hover:text-[#5a2ea6] hover:bg-[#6A38C2]/10 h-8 px-2 text-xs font-medium"
        >
          <Plus size={14} className="mr-1" /> Add Skill
        </Button>
      </div>

      {/* Grid danh sách kỹ năng */}
      <div className="space-y-3">
        {cvData.skills.map((skill, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-3 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow group relative"
          >
            {/* Icon đại diện */}
            <div className="h-10 w-10 shrink-0 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 font-bold text-lg uppercase select-none">
              {skill.name ? skill.name.charAt(0) : "?"}
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="space-y-0.5">
                <Label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider ml-1">
                  Skill Name
                </Label>
                <Input
                  placeholder="e.g. ReactJS"
                  value={skill.name}
                  onChange={(e) => update(i, "name", e.target.value)}
                  className="bg-gray-50 border-gray-200 h-7 text-sm focus:bg-white transition-colors px-2"
                />
              </div>

              <div className="space-y-0.5">
                <Label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider ml-1">
                  Level
                </Label>
                <Select
                  value={skill.level}
                  onValueChange={(val) => update(i, "level", val)}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200 h-7 text-xs focus:bg-white px-2">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Nút xóa (chỉ hiện khi hover) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => remove(i)}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border shadow-sm text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all z-10"
            >
              <Trash2 size={12} />
            </Button>
          </div>
        ))}
      </div>

      {/* Hiển thị thông báo nếu chưa có skill nào */}
      {cvData.skills.length === 0 && (
        <div
          onClick={add}
          className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 cursor-pointer hover:border-[#6A38C2]/30 hover:bg-[#6A38C2]/5 transition-all flex flex-col items-center justify-center gap-2"
        >
          <div className="p-2 bg-white rounded-full shadow-sm">
            <Plus size={20} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 font-medium">
            No skills added yet. Click to add your first skill.
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
