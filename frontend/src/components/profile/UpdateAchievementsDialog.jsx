import { useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Star, Plus, Trash2 } from "lucide-react";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { achievementSchema } from "@/lib/achievementSchema";

export default function UpdateAchievementsDialog({
  open,
  setOpen,
  initialData = [],
  onUpdate,
}) {
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(achievementSchema),
    defaultValues: { achievements: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "achievements",
  });

  // Load lại dữ liệu mỗi khi mở dialog
  useEffect(() => {
    if (open) {
      reset({
        achievements: initialData.length > 0 ? initialData : [""],
      });
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        { achievements: data.achievements },
        { withCredentials: true }
      );

      if (res.data.success) {
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
      <DialogContent className="max-w-2xl bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Star className="text-[#6A38C2]" size={20} />
            Update Achievements
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Add, edit, or remove your professional or academic achievements
            below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative border border-gray-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Nút xoá */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                  title="Remove"
                >
                  <Trash2 size={18} />
                </button>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Achievement
                  </Label>
                  <Input
                    {...register(`achievements.${index}`)}
                    placeholder="e.g. Top 10 Outstanding Students 2024"
                    className="border-gray-200 focus:border-[#6A38C2] focus:ring-[#6A38C2]/40"
                  />
                  {errors.achievements?.[index] && (
                    <p className="text-xs text-red-500">
                      {errors.achievements[index]?.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <DialogFooter className="flex justify-between mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => append("")}
              className="flex items-center gap-2 border-[#6A38C2]/30 text-[#6A38C2]"
            >
              <Plus size={16} /> Add Achievement
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#6A38C2] hover:bg-[#592ba3] text-white px-6"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
