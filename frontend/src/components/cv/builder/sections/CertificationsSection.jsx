import { Input } from "@/components/ui/input";

const CertificationsSection = ({ cvData, updateField }) => {
  const update = (index, key, val) => {
    const cloned = cvData.certifications.map((c) => structuredClone(c));
    cloned[index][key] = val;
    updateField("certifications", cloned);
  };

  const add = () => {
    updateField("certifications", [
      ...cvData.certifications.map((c) => structuredClone(c)),
      { name: "", organization: "", dateIssued: "" },
    ]);
  };

  const remove = (index) => {
    updateField(
      "certifications",
      cvData.certifications
        .filter((_, i) => i !== index)
        .map((c) => structuredClone(c))
    );
  };

  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold mb-3">Certifications</h3>

      {cvData.certifications.map((c, i) => (
        <div key={i} className="mb-4 p-3 border rounded-lg bg-gray-50">
          <Input
            className="mb-2"
            placeholder="Certificate Title"
            value={c.name}
            onChange={(e) => update(i, "name", e.target.value)}
          />

          <Input
            className="mb-2"
            placeholder="Organization"
            value={c.organization}
            onChange={(e) => update(i, "organization", e.target.value)}
          />

          <Input
            placeholder="Date"
            value={c.dateIssued}
            onChange={(e) => update(i, "dateIssued", e.target.value)}
          />

          <button
            onClick={() => remove(i)}
            className="text-red-600 text-sm mt-2"
          >
            Delete
          </button>
        </div>
      ))}

      <button className="text-[#6A38C2]" onClick={add}>
        + Add Certificate
      </button>
    </div>
  );
};

export default CertificationsSection;
