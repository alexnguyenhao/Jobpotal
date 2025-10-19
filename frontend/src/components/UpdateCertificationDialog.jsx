import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

export default function UpdateCertificationDialog({
  open,
  setOpen,
  initialData = [],
  onUpdate,
}) {
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    if (open) {
      setCertifications(
        initialData.length > 0
          ? initialData
          : [{ name: "", organization: "", dateIssued: "" }]
      );
    }
  }, [open, initialData]);

  const handleChange = (index, field, value) => {
    const updated = [...certifications];
    updated[index][field] = value;
    setCertifications(updated);
  };

  const addCertification = () => {
    setCertifications([
      ...certifications,
      { name: "", organization: "", dateIssued: "" },
    ]);
  };

  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        { certifications },
        { withCredentials: true }
      );
      //check empty field
      if (res.data.success) {
        // Cập nhật redux nếu cần
        onUpdate && onUpdate(res.data.user.profile.certifications);
        toast.success("Education updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update education!"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Certifications</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="border p-4 rounded-xl shadow-sm space-y-2 bg-gray-50"
            >
              <Input
                placeholder="Certification Name"
                value={cert.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
              <Input
                placeholder="Organization"
                value={cert.organization}
                onChange={(e) =>
                  handleChange(index, "organization", e.target.value)
                }
              />
              <Input
                type="date"
                placeholder="Date Issued"
                value={cert.dateIssued}
                onChange={(e) =>
                  handleChange(index, "dateIssued", e.target.value)
                }
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeCertification(index)}
                className="mt-2"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={addCertification}>
            + Add Certification
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
