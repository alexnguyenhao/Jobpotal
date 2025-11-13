import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ProjectsSection = ({ cvData, updateField }) => {
  const onEdit = (i, key, val) => {
    const arr = [...cvData.projects];
    arr[i][key] = val;
    updateField("projects", arr);
  };

  const add = () =>
    updateField("projects", [
      ...cvData.projects,
      { title: "", link: "", description: "", technologies: [] },
    ]);

  const del = (i) =>
    updateField(
      "projects",
      cvData.projects.filter((_, idx) => idx !== i)
    );

  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold mb-3">Projects</h3>

      {cvData.projects.map((p, i) => (
        <div key={i} className="mb-4 p-3 border rounded-lg bg-gray-50">
          <Input
            className="mb-2"
            placeholder="Project Name"
            value={p.title}
            onChange={(e) => onEdit(i, "title", e.target.value)}
          />

          <Input
            className="mb-2"
            placeholder="Project Link"
            value={p.link}
            onChange={(e) => onEdit(i, "link", e.target.value)}
          />

          <Textarea
            rows={3}
            placeholder="Description"
            value={p.description}
            onChange={(e) => onEdit(i, "description", e.target.value)}
          />

          <Textarea
            rows={2}
            className="mt-2"
            placeholder="Tech stack (comma-separated)"
            value={p.technologies.join(", ")}
            onChange={(e) =>
              onEdit(
                i,
                "technologies",
                e.target.value.split(",").map((x) => x.trim())
              )
            }
          />

          <button className="text-red-600 text-sm mt-2" onClick={() => del(i)}>
            Delete
          </button>
        </div>
      ))}

      <button className="text-[#6A38C2] font-medium" onClick={add}>
        + Add Project
      </button>
    </div>
  );
};

export default ProjectsSection;
