import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const OperationsSection = ({ cvData, updateField }) => {
  const handleEdit = (index, key, val) => {
    const cloned = cvData.operations.map((item) => structuredClone(item));
    cloned[index][key] = val;
    updateField("operations", cloned);
  };

  const handleAdd = () => {
    updateField("operations", [
      ...cvData.operations.map((i) => structuredClone(i)),
      {
        title: "",
        position: "",
        description: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const handleDelete = (index) => {
    updateField(
      "operations",
      cvData.operations
        .filter((_, i) => i !== index)
        .map((i) => structuredClone(i))
    );
  };

  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold mb-3">Operations</h3>

      {cvData.operations.map((item, i) => (
        <div key={i} className="mb-4 p-3 border rounded-lg bg-gray-50">
          <Input
            className="mb-2"
            placeholder="Title"
            value={item.title}
            onChange={(e) => handleEdit(i, "title", e.target.value)}
          />

          <Input
            className="mb-2"
            placeholder="Position"
            value={item.position}
            onChange={(e) => handleEdit(i, "position", e.target.value)}
          />

          <Input
            className="mb-2"
            placeholder="Description"
            value={item.description}
            onChange={(e) => handleEdit(i, "description", e.target.value)}
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
          <button
            onClick={() => handleDelete(i)}
            className="text-red-600 text-sm mt-2"
          >
            Delete
          </button>
        </div>
      ))}

      <button onClick={handleAdd} className="text-[#6A38C2] font-medium mt-2">
        + Add Operation
      </button>
    </div>
  );
};

export default OperationsSection;
