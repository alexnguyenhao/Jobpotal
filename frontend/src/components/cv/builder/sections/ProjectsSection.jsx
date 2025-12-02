import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, FolderGit2 } from "lucide-react";

const ProjectsSection = ({ cvData, updateField }) => {
  const onEdit = (index, key, val) => {
    const cloned = cvData.projects.map((p) => ({ ...p }));
    cloned[index][key] = val;
    updateField("projects", cloned);
  };

  const add = () => {
    updateField("projects", [
      ...cvData.projects,
      {
        title: "",
        link: "",
        description: "",
        technologies: [],
        startDate: "",
        endDate: "",
        isWorking: false,
      },
    ]);
  };

  const del = (index) => {
    updateField(
      "projects",
      cvData.projects.filter((_, i) => i !== index)
    );
  };

  const toggleWorking = (index, isChecked) => {
    const cloned = cvData.projects.map((p) => ({ ...p }));
    cloned[index].isWorking = isChecked;
    if (isChecked) cloned[index].endDate = "";
    updateField("projects", cloned);
  };

  return (
    <div className="space-y-6">
      {cvData.projects.map((p, i) => (
        <div
          key={i}
          className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#6A38C2]">
              <FolderGit2 size={18} />
              <span className="font-semibold text-sm">Project #{i + 1}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => del(i)}
              className="text-red-500 hover:bg-red-50 h-8 w-8"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Project Title</Label>
            <Input
              placeholder="e.g. E-commerce Website"
              value={p.title}
              onChange={(e) => onEdit(i, "title", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Start Date</Label>
              <Input
                type="date"
                value={p.startDate ? p.startDate.split("T")[0] : ""}
                onChange={(e) => onEdit(i, "startDate", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <Label className="text-xs text-gray-500">End Date</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`proj-working-${i}`}
                    checked={p.isWorking}
                    onChange={(e) => toggleWorking(i, e.target.checked)}
                    className="w-3 h-3 text-[#6A38C2] rounded border-gray-300"
                  />
                  <Label
                    htmlFor={`proj-working-${i}`}
                    className="text-xs cursor-pointer text-gray-600 select-none"
                  >
                    Ongoing
                  </Label>
                </div>
              </div>
              <Input
                type="date"
                disabled={p.isWorking}
                value={p.endDate && !p.isWorking ? p.endDate.split("T")[0] : ""}
                onChange={(e) => onEdit(i, "endDate", e.target.value)}
                className={p.isWorking ? "bg-gray-100" : ""}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Project Link</Label>
            <Input
              placeholder="https://github.com/..."
              value={p.link}
              onChange={(e) => onEdit(i, "link", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Technologies Used</Label>
            <Input
              placeholder="React, Node.js, MongoDB (comma separated)"
              value={p.technologies.join(", ")}
              onChange={(e) =>
                onEdit(
                  i,
                  "technologies",
                  e.target.value.split(",").map((x) => x.trim())
                )
              }
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Description</Label>
            <Textarea
              rows={3}
              placeholder="What did you build? What was your role?"
              value={p.description}
              onChange={(e) => onEdit(i, "description", e.target.value)}
            />
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={add}
        className="w-full border-dashed border-2 py-6 text-[#6A38C2] border-[#6A38C2]/20 hover:bg-[#6A38C2]/5"
      >
        <Plus size={16} className="mr-2" /> Add Project
      </Button>
    </div>
  );
};

export default ProjectsSection;
