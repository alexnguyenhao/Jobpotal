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
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema } from "@/lib/educationSchema";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import DatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

export default function UpdateEducationDialog({ open, setOpen }) {
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
    resolver: zodResolver(educationSchema),
    defaultValues: { education: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });
  useEffect(() => {
    if (open) {
      reset({
        education:
          user?.profile?.education?.length > 0
            ? user.profile.education
            : [
                {
                  school: "",
                  degree: "",
                  major: "",
                  startDate: "",
                  endDate: "",
                },
              ],
      });
    }
  }, [open, user, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        { education: data.education },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Education updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update education!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <GraduationCap className="text-[#6A38C2]" size={20} />
            Update Education
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Add, edit, or remove your academic background below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative border border-gray-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-4"
              >
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                  disabled={fields.length === 1}
                >
                  <Trash2 size={18} />
                </button>

                {/* School */}
                <div className="space-y-2">
                  <Label>School / University</Label>
                  <Input
                    {...register(`education.${index}.school`)}
                    placeholder="e.g. Harvard University"
                  />
                  {errors.education?.[index]?.school && (
                    <p className="text-xs text-red-500">
                      {errors.education[index].school.message}
                    </p>
                  )}
                </div>

                {/* Degree */}
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input
                    {...register(`education.${index}.degree`)}
                    placeholder="e.g. Bachelor's"
                  />
                  {errors.education?.[index]?.degree && (
                    <p className="text-xs text-red-500">
                      {errors.education[index].degree.message}
                    </p>
                  )}
                </div>

                {/* Major */}
                <div className="space-y-2">
                  <Label>Major / Field of Study</Label>
                  <Input
                    {...register(`education.${index}.major`)}
                    placeholder="e.g. Software Engineering"
                  />
                  {errors.education?.[index]?.major && (
                    <p className="text-xs text-red-500">
                      {errors.education[index].major.message}
                    </p>
                  )}
                </div>

                {/* Years */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Start Date</Label>
                    <Controller
                      control={control}
                      name={`education.${index}.startDate`}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value ? parseISO(field.value) : null}
                          onChange={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : ""
                            )
                          }
                          dateFormat="dd-MM-yyyy"
                          placeholderText="choice start date"
                          className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-[#6A38C2]/50 focus:border-[#6A38C2]"
                          locale={vi}
                        />
                      )}
                    />
                    {errors.education?.[index]?.startDate && (
                      <p className="text-xs text-red-500">
                        {errors.education[index].startDate.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label>End Date</Label>
                    <Controller
                      control={control}
                      name={`education.${index}.endDate`}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value ? parseISO(field.value) : null}
                          onChange={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : ""
                            )
                          }
                          dateFormat="dd-MM-yyyy"
                          placeholderText="Choice end date"
                          className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-[#6A38C2]/50 focus:border-[#6A38C2]"
                          locale={vi}
                        />
                      )}
                    />
                    {errors.education?.[index]?.endDate && (
                      <p className="text-xs text-red-500">
                        {errors.education[index].endDate.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="flex justify-between mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  school: "",
                  degree: "",
                  major: "",
                  startDate: "",
                  endDate: "",
                })
              }
              className="flex items-center gap-2 border-[#6A38C2]/30 text-[#6A38C2]"
            >
              <Plus size={16} /> Add Education
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
