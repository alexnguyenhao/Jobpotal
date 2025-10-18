import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

export default function UpdateEducationDialog({
  open,
  setOpen,
  initialData = [],
  onUpdate,
}) {
  const [educationList, setEducationList] = useState([]);

  useEffect(() => {
    if (open) {
      setEducationList(
        initialData.length > 0
          ? initialData
          : [{ school: "", degree: "", major: "", startYear: "", endYear: "" }]
      );
    }
  }, [open, initialData]);

  const handleChange = (index, field, value) => {
    const updated = [...educationList];
    updated[index][field] = value;
    setEducationList(updated);
  };

  const addEducation = () => {
    setEducationList([
      ...educationList,
      { school: "", degree: "", major: "", startYear: "", endYear: "" },
    ]);
  };

  const removeEducation = (index) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        { education: educationList },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Cập nhật redux nếu cần
        onUpdate && onUpdate(res.data.user.profile.education);
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
          <DialogTitle>Education</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {educationList.map((edu, index) => (
            <div
              key={index}
              className="border p-4 rounded-xl shadow-sm space-y-2 bg-gray-50"
            >
              <Input
                placeholder="School"
                value={edu.school}
                onChange={(e) => handleChange(index, "school", e.target.value)}
              />
              <Input
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => handleChange(index, "degree", e.target.value)}
              />
              <Input
                placeholder="Major"
                value={edu.major}
                onChange={(e) => handleChange(index, "major", e.target.value)}
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Start Year"
                  value={edu.startYear}
                  onChange={(e) =>
                    handleChange(index, "startYear", e.target.value)
                  }
                />
                <Input
                  type="number"
                  placeholder="End Year"
                  value={edu.endYear}
                  onChange={(e) =>
                    handleChange(index, "endYear", e.target.value)
                  }
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeEducation(index)}
                className="mt-2"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={addEducation}>
            + Add Education
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
