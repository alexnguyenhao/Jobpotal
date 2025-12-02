import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
          <div className="mb-2">
            <Label className="text-xs text-gray-500">Title</Label>
            <Input
              placeholder="Title"
              value={item.title}
              onChange={(e) => handleEdit(i, "title", e.target.value)}
            />
          </div>

          <div className="mb-2">
            <Label className="text-xs text-gray-500">Position</Label>
            <Input
              placeholder="Position"
              value={item.position}
              onChange={(e) => handleEdit(i, "position", e.target.value)}
            />
          </div>

          <div className="mb-2">
            <Label className="text-xs text-gray-500">Description</Label>
            <Input
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleEdit(i, "description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-500">Start Date</Label>
              <Input
                type="date"
                value={item.startDate ? item.startDate.split("T")[0] : ""}
                onChange={(e) => handleEdit(i, "startDate", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">End Date</Label>
              <Input
                type="date"
                value={item.endDate ? item.endDate.split("T")[0] : ""}
                onChange={(e) => handleEdit(i, "endDate", e.target.value)}
              />
            </div>
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
