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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FolderGit2, Plus, Trash2 } from "lucide-react";
import { USER_API_END_POINT } from "@/utils/constant";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const projectSchema = z.object({
  projects: z.array(
    z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().optional(),
      link: z.string().optional(),
      technologies: z.array(z.string()).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional().nullable(),
      isWorking: z.boolean().default(false),
    })
  ),
});

export default function UpdateProjectsDialog({ open, setOpen }) {
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
    resolver: zodResolver(projectSchema),
    defaultValues: { projects: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  useEffect(() => {
    if (open && user?.profile) {
      reset({
        projects:
          user?.profile?.projects?.length > 0
            ? user.profile.projects.map((p) => ({
                ...p,
                startDate: p.startDate ? p.startDate.split("T")[0] : "",
                endDate: p.endDate ? p.endDate.split("T")[0] : "",
                isWorking: p.isWorking || false,
                technologies: p.technologies || [],
              }))
            : [
                {
                  title: "",
                  description: "",
                  link: "",
                  technologies: [],
                  startDate: "",
                  endDate: "",
                  isWorking: false,
                },
              ],
      });
    }
  }, [open, user, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formattedData = data.projects.map((p) => ({
        ...p,
        endDate: p.isWorking ? null : p.endDate,
      }));

      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        { projects: formattedData },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Projects updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update projects!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl bg-gradient-to-b from-white to-gray-50 border border-gray-100 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <FolderGit2 className="text-[#6A38C2]" size={20} />
            Projects
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Update your personal or academic projects.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
            {fields.map((field, index) => {
              const isWorking = watch(`projects.${index}.isWorking`);
              return (
                <div
                  key={field.id}
                  className="relative border border-gray-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md space-y-3"
                >
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="space-y-1">
                    <Label>Project Title</Label>
                    <Input
                      {...register(`projects.${index}.title`)}
                      placeholder="e.g. JobPortal"
                    />
                    {errors.projects?.[index]?.title && (
                      <p className="text-xs text-red-500">
                        {errors.projects[index].title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label>Link</Label>
                    <Input
                      {...register(`projects.${index}.link`)}
                      placeholder="GitHub / Demo URL"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Start Date</Label>
                      <Controller
                        control={control}
                        name={`projects.${index}.startDate`}
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
                      <Label className={isWorking ? "text-gray-400" : ""}>
                        End Date
                      </Label>
                      <Controller
                        control={control}
                        name={`projects.${index}.endDate`}
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
                            disabled={isWorking}
                            className={`w-full border border-gray-200 rounded-md px-3 py-2 ${
                              isWorking ? "bg-gray-100 cursor-not-allowed" : ""
                            }`}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Controller
                      control={control}
                      name={`projects.${index}.isWorking`}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          id={`proj-working-${index}`}
                          checked={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.checked);
                            if (e.target.checked)
                              setValue(`projects.${index}.endDate`, null);
                          }}
                          className="w-4 h-4 text-[#6A38C2] rounded border-gray-300 focus:ring-[#6A38C2]"
                        />
                      )}
                    />
                    <Label
                      htmlFor={`proj-working-${index}`}
                      className="text-sm cursor-pointer"
                    >
                      In Progress
                    </Label>
                  </div>

                  <div className="space-y-1">
                    <Label>Technologies</Label>
                    <Input
                      defaultValue={field.technologies?.join(", ") || ""}
                      onChange={(e) => {
                        setValue(
                          `projects.${index}.technologies`,
                          e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                        );
                      }}
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Description</Label>
                    <Textarea
                      {...register(`projects.${index}.description`)}
                      placeholder="Description..."
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <DialogFooter className="flex justify-between items-center pt-4 mt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  title: "",
                  description: "",
                  link: "",
                  technologies: [],
                  startDate: "",
                  endDate: "",
                  isWorking: false,
                })
              }
              className="flex items-center gap-2 border-[#6A38C2]/30 text-[#6A38C2]"
            >
              <Plus size={16} /> Add Project
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
