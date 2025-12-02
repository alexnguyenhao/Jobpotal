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
import { Checkbox } from "@/components/ui/checkbox"; // Đảm bảo bạn có component này hoặc dùng input type checkbox
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import DatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

const educationSchema = z.object({
  education: z.array(
    z.object({
      school: z.string().min(1, "School name is required"),
      degree: z.string().optional(),
      major: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional().nullable(),
      isCurrent: z.boolean().default(false),
    })
  ),
});

export default function UpdateEducationDialog({ open, setOpen }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    register,
    watch,
    setValue,
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
            ? user.profile.education.map((edu) => ({
                ...edu,
                startDate: edu.startDate ? edu.startDate.split("T")[0] : "",
                endDate: edu.endDate ? edu.endDate.split("T")[0] : "",
                isCurrent: edu.isCurrent || false,
              }))
            : [
                {
                  school: "",
                  degree: "",
                  major: "",
                  startDate: "",
                  endDate: "",
                  isCurrent: false,
                },
              ],
      });
    }
  }, [open, user, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Xử lý logic: Nếu isCurrent = true thì gửi endDate = null
      const formattedData = data.education.map((edu) => ({
        ...edu,
        endDate: edu.isCurrent ? null : edu.endDate,
      }));

      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        { education: formattedData },
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
            Add, edit, or remove your academic background.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
            {fields.map((field, index) => {
              const isCurrent = watch(`education.${index}.isCurrent`);
              return (
                <div
                  key={field.id}
                  className="relative border border-gray-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md space-y-4"
                >
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Degree</Label>
                      <Input
                        {...register(`education.${index}.degree`)}
                        placeholder="e.g. Bachelor's"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Major</Label>
                      <Input
                        {...register(`education.${index}.major`)}
                        placeholder="e.g. CS"
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Start Date</Label>
                      <Controller
                        control={control}
                        name={`education.${index}.startDate`}
                        render={({ field }) => (
                          <DatePicker
                            selected={
                              field.value ? parseISO(field.value) : null
                            }
                            onChange={(date) =>
                              field.onChange(
                                date ? format(date, "yyyy-MM-dd") : ""
                              )
                            }
                            dateFormat="dd-MM-yyyy"
                            className="w-full border border-gray-200 rounded-md px-3 py-2"
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className={isCurrent ? "text-gray-400" : ""}>
                        End Date
                      </Label>
                      <Controller
                        control={control}
                        name={`education.${index}.endDate`}
                        render={({ field }) => (
                          <DatePicker
                            selected={
                              field.value ? parseISO(field.value) : null
                            }
                            onChange={(date) =>
                              field.onChange(
                                date ? format(date, "yyyy-MM-dd") : ""
                              )
                            }
                            dateFormat="dd-MM-yyyy"
                            disabled={isCurrent}
                            className={`w-full border border-gray-200 rounded-md px-3 py-2 ${
                              isCurrent ? "bg-gray-100 cursor-not-allowed" : ""
                            }`}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Is Current Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Controller
                      control={control}
                      name={`education.${index}.isCurrent`}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          id={`isCurrent-${index}`}
                          checked={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.checked);
                            if (e.target.checked)
                              setValue(`education.${index}.endDate`, null);
                          }}
                          className="w-4 h-4 text-[#6A38C2] rounded border-gray-300 focus:ring-[#6A38C2]"
                        />
                      )}
                    />
                    <Label
                      htmlFor={`isCurrent-${index}`}
                      className="text-sm cursor-pointer"
                    >
                      Currently studying here
                    </Label>
                  </div>
                </div>
              );
            })}
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
                  isCurrent: false,
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
