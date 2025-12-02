import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Zap, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";

// Schema validation cho Skill
const skillSchema = z.object({
  skills: z.array(
    z.object({
      name: z.string().min(1, "Skill name is required"),
      level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
    })
  ),
});

export default function UpdateSkillsDialog({ open, setOpen }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: { skills: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  useEffect(() => {
    if (open) {
      // Map data từ Redux vào form
      reset({
        skills:
          user?.profile?.skills?.length > 0
            ? user.profile.skills.map((s) => ({
                name: s.name,
                level: s.level || "Intermediate",
              }))
            : [{ name: "", level: "Intermediate" }],
      });
    }
  }, [open, user, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Gửi mảng object [{name, level}, ...]
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        { skills: data.skills },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Skills updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update skills!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Zap className="text-[#6A38C2]" size={20} />
            Update Skills
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Highlight your technical skills and proficiency levels.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative flex gap-4 items-start border border-gray-200 bg-white rounded-xl p-4 shadow-sm"
              >
                {/* Skill Name */}
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-gray-500">Skill Name</Label>
                  <Input
                    {...register(`skills.${index}.name`)}
                    placeholder="e.g. ReactJS"
                    className="h-9"
                  />
                  {errors.skills?.[index]?.name && (
                    <p className="text-xs text-red-500">
                      {errors.skills[index].name.message}
                    </p>
                  )}
                </div>

                {/* Level */}
                <div className="w-1/3 space-y-1">
                  <Label className="text-xs text-gray-500">Level</Label>
                  <Controller
                    control={control}
                    name={`skills.${index}.level`}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-6 text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <DialogFooter className="flex justify-between mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ name: "", level: "Intermediate" })}
              className="flex items-center gap-2 border-[#6A38C2]/30 text-[#6A38C2]"
            >
              <Plus size={16} /> Add Skill
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#6A38C2] hover:bg-[#592ba3] text-white px-6"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
