import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";

export default function UpdateLanguagesDialog({
  open,
  setOpen,
  initialData = [],
  onUpdate,
}) {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    if (open) {
      setLanguages(
        initialData.length > 0
          ? initialData
          : [{ language: "", proficiency: "Beginner" }]
      );
    }
  }, [open, initialData]);

  const handleChange = (index, field, value) => {
    const updated = [...languages];
    updated[index][field] = value;
    setLanguages(updated);
  };

  const addLanguage = () => {
    setLanguages([...languages, { language: "", proficiency: "Beginner" }]);
  };

  const removeLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        { languages },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Cập nhật redux
        onUpdate && onUpdate(res.data.user.profile.languages);
        toast.success("Languages updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update languages!"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Languages</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {languages.map((lang, index) => (
            <div
              key={index}
              className="border p-4 rounded-xl shadow-sm space-y-2 bg-gray-50"
            >
              <Input
                placeholder="Language"
                value={lang.language}
                onChange={(e) =>
                  handleChange(index, "language", e.target.value)
                }
              />
              <Input
                placeholder="Proficiency (Beginner, Intermediate, Advanced, Fluent)"
                value={lang.proficiency}
                onChange={(e) =>
                  handleChange(index, "proficiency", e.target.value)
                }
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeLanguage(index)}
                className="mt-2"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={addLanguage}>
            + Add Language
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
