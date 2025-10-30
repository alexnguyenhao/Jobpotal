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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FolderGit2, Plus, Trash2 } from "lucide-react";
import { USER_API_END_POINT } from "@/utils/constant";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "@/lib/projectSchema";

export default function UpdateProjectsDialog({ open, setOpen }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { projects: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  // 🔁 Load dữ liệu khi mở
  useEffect(() => {
    if (open && user?.profile) {
      reset({
        projects:
          user?.profile?.projects?.length > 0
            ? user.profile.projects
            : [
                {
                  title: "",
                  description: "",
                  link: "",
                  technologies: [],
                },
              ],
      });
    }
  }, [open, user, reset]);
  // 🚀 Submit handler
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        { projects: data.projects },
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
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl bg-gradient-to-b from-white to-gray-50 border border-gray-100 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <FolderGit2 className="text-[#6A38C2]" size={20} />
            Personal / Study Projects
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Add, edit, or remove your personal or academic projects below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative border border-gray-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Xóa project */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                  title="Remove project"
                >
                  <Trash2 size={18} />
                </button>

                {/* Title */}
                <div className="space-y-2">
                  <Label>Project Title</Label>
                  <Input
                    {...register(`projects.${index}.title`)}
                    placeholder="e.g. JobPortal Web App"
                    className="border-gray-200 focus:border-[#6A38C2] focus:ring-[#6A38C2]/40"
                  />
                  {errors.projects?.[index]?.title && (
                    <p className="text-xs text-red-500">
                      {errors.projects[index].title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    {...register(`projects.${index}.description`)}
                    placeholder="Short description about this project"
                    className="border-gray-200 focus:border-[#6A38C2] focus:ring-[#6A38C2]/40"
                  />
                  {errors.projects?.[index]?.description && (
                    <p className="text-xs text-red-500">
                      {errors.projects[index].description.message}
                    </p>
                  )}
                </div>

                {/* Link */}
                <div className="space-y-2">
                  <Label>Link (GitHub, Behance, Drive…)</Label>
                  <Input
                    {...register(`projects.${index}.link`)}
                    placeholder="https://github.com/your-project"
                    className="border-gray-200 focus:border-[#6A38C2] focus:ring-[#6A38C2]/40"
                  />
                  {errors.projects?.[index]?.link && (
                    <p className="text-xs text-red-500">
                      {errors.projects[index].link.message}
                    </p>
                  )}
                </div>

                {/* Technologies */}
                <div className="space-y-2">
                  <Label>Technologies / Tools</Label>
                  <Input
                    type="text"
                    defaultValue={field.technologies?.join(", ") || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Ghi tạm chuỗi người dùng nhập (bao gồm dấu phẩy)
                      setValue(
                        `projects.${index}.technologies`,
                        value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean)
                      );
                    }}
                    placeholder="React, Node.js, MongoDB"
                    onKeyDown={(e) => {
                      // Cho phép nhập dấu phẩy bình thường
                      if (e.key === "," || e.key === "Comma") return;
                    }}
                    className="border-gray-200 focus:border-[#6A38C2] focus:ring-[#6A38C2]/40"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate technologies with commas (,)
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
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
                })
              }
              className="flex items-center gap-2 border-[#6A38C2]/30 text-[#6A38C2]"
            >
              <Plus size={16} /> Add Project
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
