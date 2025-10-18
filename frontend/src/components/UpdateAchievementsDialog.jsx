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

export default function UpdateAchievementsDialog({
  open,
  setOpen,
  initialData = [],
  onUpdate,
}) {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    if (open) {
      setAchievements(initialData.length > 0 ? initialData : [""]);
    }
  }, [open, initialData]);

  const handleChange = (index, value) => {
    const updated = [...achievements];
    updated[index] = value;
    setAchievements(updated);
  };

  const addAchievement = () => {
    setAchievements([...achievements, ""]);
  };

  const removeAchievement = (index) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        { achievements },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Cập nhật redux nếu cần
        onUpdate && onUpdate(res.data.user.profile.achievements);
        toast.success("Achievements updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update achievements!"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Achievements</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {achievements.map((ach, index) => (
            <div
              key={index}
              className="border p-4 rounded-xl shadow-sm space-y-2 bg-gray-50"
            >
              <Input
                placeholder="Achievement"
                value={ach}
                onChange={(e) => handleChange(index, e.target.value)}
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeAchievement(index)}
                className="mt-2"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={addAchievement}>
            + Add Achievement
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
