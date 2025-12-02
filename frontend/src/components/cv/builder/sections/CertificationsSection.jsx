import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";

const CertificationsSection = ({ cvData, updateField }) => {
  const update = (index, key, val) => {
    const cloned = cvData.certifications.map((c) => ({ ...c }));
    cloned[index][key] = val;
    updateField("certifications", cloned);
  };

  const add = () => {
    updateField("certifications", [
      ...cvData.certifications,
      {
        name: "",
        organization: "",
        dateIssued: "",
        expirationDate: "",
        url: "",
      },
    ]);
  };

  const remove = (index) => {
    updateField(
      "certifications",
      cvData.certifications.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4">
      {cvData.certifications.map((c, i) => (
        <div
          key={i}
          className="p-4 border rounded-lg bg-gray-50 relative group"
        >
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-1">
                <Label className="text-xs text-gray-500">
                  Certificate Name
                </Label>
                <Input
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={c.name}
                  onChange={(e) => update(i, "name", e.target.value)}
                  className="bg-white"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(i)}
                className="text-red-500 hover:bg-red-50 ml-2 mt-4"
              >
                <Trash2 size={16} />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Organization</Label>
                <Input
                  placeholder="e.g. Amazon Web Services"
                  value={c.organization}
                  onChange={(e) => update(i, "organization", e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Certificate URL</Label>
                <Input
                  placeholder="https://..."
                  value={c.url || ""}
                  onChange={(e) => update(i, "url", e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Date Issued</Label>
                <Input
                  type="date"
                  value={c.dateIssued ? c.dateIssued.split("T")[0] : ""}
                  onChange={(e) => update(i, "dateIssued", e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Expiration Date</Label>
                <Input
                  type="date"
                  value={c.expirationDate ? c.expirationDate.split("T")[0] : ""}
                  onChange={(e) => update(i, "expirationDate", e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        onClick={add}
        className="text-[#6A38C2] hover:text-[#5b30a6] hover:bg-purple-50 p-0 h-auto font-medium"
      >
        + Add Certificate
      </Button>
    </div>
  );
};

export default CertificationsSection;
