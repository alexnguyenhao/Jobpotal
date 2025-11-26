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
import { PenLine } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";


const titleSchema = z.object({
  description: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .max(255, "Title too long (max 255 characters)"),
});
export default function UpdateTitleProfileDialog({
  open,
  setOpen,
  initialData = "",
  onUpdate,
}) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(titleSchema),
    defaultValues: { description: "" },
  });

  useEffect(() => {
    if (initialData) {
      reset({ description: initialData });
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        { interests: data.description },
        { withCredentials: true }
      );

    if (res.data.success) {
      dispatch(setUser(res.data.user)); // 🔥 QUAN TRỌNG
      onUpdate && onUpdate(res.data.user?.profile?.interests || data.description);
      toast.success("Interests updated successfully!");
      setOpen(false);
    }

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update title");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg bg-gradient-to-b from-white to-gray-50 shadow-xl border border-gray-100 rounded-2xl">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <PenLine className="text-[#6A38C2]" size={20} />
            Update Interests
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Update your interests.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3 mt-4">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Interests
            </Label>
            <Input
              id="description"
              {...register("description")}
              placeholder="reading, music, etc."
              className="border-gray-200 focus:ring-[#6A38C2]/50 focus:border-[#6A38C2]"
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter className="flex justify-end mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
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
