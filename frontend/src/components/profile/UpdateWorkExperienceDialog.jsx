import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { USER_API_END_POINT } from "@/utils/constant";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import DatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const workSchema = z.object({
  experiences: z.array(
    z.object({
      company: z.string().min(1, "Company name is required"),
      position: z.string().min(1, "Position is required"),
      startDate: z.string().optional(),
      endDate: z.string().optional().nullable(),
      isCurrent: z.boolean().default(false),
      description: z.string().optional(),
    })
  ),
});

export default function UpdateWorkExperienceDialog({ open, setOpen }) {
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
    resolver: zodResolver(workSchema),
    defaultValues: { experiences: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

  useEffect(() => {
    if (open) {
      reset({
        experiences:
          user?.profile?.workExperience?.length > 0
            ? user.profile.workExperience.map((exp) => ({
                ...exp,
                startDate: exp.startDate ? exp.startDate.split("T")[0] : "",
                endDate: exp.endDate ? exp.endDate.split("T")[0] : "",
                isCurrent: exp.isCurrent || false,
              }))
            : [
                {
                  company: "",
                  position: "",
                  startDate: "",
                  endDate: "",
                  isCurrent: false,
                  description: "",
                },
              ],
      });
    }
  }, [open, user, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formattedData = data.experiences.map((exp) => ({
        ...exp,
        endDate: exp.isCurrent ? null : exp.endDate,
      }));

      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        { workExperience: formattedData },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Work experience updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Briefcase className="text-[#6A38C2]" size={20} />
            Update Work Experience
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Add, edit, or remove your past work experiences.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
            {fields.map((field, index) => {
              const isCurrent = watch(`experiences.${index}.isCurrent`);
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

                  <div className="space-y-1">
                    <Label>Company</Label>
                    <Input
                      {...register(`experiences.${index}.company`)}
                      placeholder="Company name"
                    />
                    {errors.experiences?.[index]?.company && (
                      <p className="text-xs text-red-500">
                        {errors.experiences[index].company.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label>Position</Label>
                    <Input
                      {...register(`experiences.${index}.position`)}
                      placeholder="Job title"
                    />
                    {errors.experiences?.[index]?.position && (
                      <p className="text-xs text-red-500">
                        {errors.experiences[index].position.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Start Date</Label>
                      <Controller
                        control={control}
                        name={`experiences.${index}.startDate`}
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
                        name={`experiences.${index}.endDate`}
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

                  <div className="flex items-center space-x-2">
                    <Controller
                      control={control}
                      name={`experiences.${index}.isCurrent`}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          id={`work-isCurrent-${index}`}
                          checked={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.checked);
                            if (e.target.checked)
                              setValue(`experiences.${index}.endDate`, null);
                          }}
                          className="w-4 h-4 text-[#6A38C2] rounded border-gray-300 focus:ring-[#6A38C2]"
                        />
                      )}
                    />
                    <Label
                      htmlFor={`work-isCurrent-${index}`}
                      className="text-sm cursor-pointer"
                    >
                      Currently working here
                    </Label>
                  </div>

                  <div className="space-y-1">
                    <Label>Description</Label>
                    <Textarea
                      {...register(`experiences.${index}.description`)}
                      placeholder="Briefly describe your role..."
                    />
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
                  company: "",
                  position: "",
                  startDate: "",
                  endDate: "",
                  isCurrent: false,
                  description: "",
                })
              }
              className="flex items-center gap-2 border-[#6A38C2]/30 text-[#6A38C2]"
            >
              <Plus size={16} /> Add Experience
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
