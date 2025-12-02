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
import { Globe, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";

// Validate URL và Platform
const socialSchema = z.object({
  socialLinks: z.array(
    z.object({
      platform: z.string().min(1, "Platform is required"),
      url: z.string().url("Must be a valid URL"),
    })
  ),
});

export default function UpdateSocialLinksDialog({ open, setOpen }) {
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
    resolver: zodResolver(socialSchema),
    defaultValues: { socialLinks: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialLinks",
  });

  // Load data từ Redux khi mở dialog
  useEffect(() => {
    if (open) {
      reset({
        socialLinks:
          user?.profile?.socialLinks?.length > 0
            ? user.profile.socialLinks
            : [{ platform: "LinkedIn", url: "" }],
      });
    }
  }, [open, user, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        { socialLinks: data.socialLinks },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Social links updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update social links!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Globe className="text-[#6A38C2]" size={20} />
            Update Social Links
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Add links to your professional profiles (LinkedIn, GitHub,
            Portfolio, etc.).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 border border-gray-200 bg-white rounded-xl p-4 shadow-sm"
              >
                {/* Platform Select */}
                <div className="w-full sm:w-1/3 space-y-1">
                  <Label className="text-xs text-gray-500">Platform</Label>
                  <Controller
                    control={control}
                    name={`socialLinks.${index}.platform`}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-9 border-gray-200">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          <SelectItem value="GitHub">GitHub</SelectItem>
                          <SelectItem value="Portfolio">Portfolio</SelectItem>
                          <SelectItem value="Twitter">Twitter</SelectItem>
                          <SelectItem value="Facebook">Facebook</SelectItem>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="Behance">Behance</SelectItem>
                          <SelectItem value="Dribbble">Dribbble</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.socialLinks?.[index]?.platform && (
                    <p className="text-xs text-red-500">Required</p>
                  )}
                </div>

                {/* URL Input */}
                <div className="flex-1 w-full space-y-1">
                  <Label className="text-xs text-gray-500">URL</Label>
                  <Input
                    {...register(`socialLinks.${index}.url`)}
                    placeholder="https://..."
                    className="h-9 border-gray-200"
                  />
                  {errors.socialLinks?.[index]?.url && (
                    <p className="text-xs text-red-500">
                      {errors.socialLinks[index].url.message}
                    </p>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2 sm:static sm:mt-6 text-gray-400 hover:text-red-500 transition"
                  title="Remove link"
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
              onClick={() => append({ platform: "LinkedIn", url: "" })}
              className="flex items-center gap-2 border-[#6A38C2]/30 text-[#6A38C2]"
            >
              <Plus size={16} /> Add Link
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
