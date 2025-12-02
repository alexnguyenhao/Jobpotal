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
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Star, Plus, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const achievementSchema = z.object({
  achievements: z.array(
    z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().optional(),
      date: z.string().optional(),
    })
  ),
});

export default function UpdateAchievementsDialog({ open, setOpen }) {
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
    resolver: zodResolver(achievementSchema),
    defaultValues: { achievements: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "achievements",
  });

  useEffect(() => {
    if (open) {
      reset({
        achievements:
          user?.profile?.achievements?.length > 0
            ? user.profile.achievements.map((a) => ({
                ...a,
                date: a.date ? a.date.split("T")[0] : "",
              }))
            : [{ title: "", description: "", date: "" }],
      });
    }
  }, [open, user, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        { achievements: data.achievements },
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Achievements updated!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Star className="text-[#6A38C2]" size={20} /> Update Achievements
          </DialogTitle>
          <DialogDescription>Add your achievements.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative border border-gray-200 bg-white rounded-xl p-5 shadow-sm space-y-3"
              >
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Input
                    {...register(`achievements.${index}.title`)}
                    placeholder="e.g. Best Employee"
                  />
                  {errors.achievements?.[index]?.title && (
                    <p className="text-xs text-red-500">
                      {errors.achievements[index].title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Input
                    {...register(`achievements.${index}.description`)}
                    placeholder="Details..."
                  />
                </div>
                <div className="space-y-1">
                  <Label>Date/Year</Label>
                  <Controller
                    control={control}
                    name={`achievements.${index}.date`}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value ? parseISO(field.value) : null}
                        onChange={(date) =>
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        }
                        dateFormat="dd-MM-yyyy"
                        showYearPicker
                        placeholderText="Select Date"
                        className="w-full border border-gray-200 rounded-md px-3 py-2"
                      />
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="flex justify-between mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ title: "", description: "", date: "" })}
              className="text-[#6A38C2]"
            >
              <Plus size={16} /> Add Achievement
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#6A38C2] text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
