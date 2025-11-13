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
import { Award, Plus, Trash2 } from "lucide-react";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certificationSchema } from "@/lib/certificationSchema";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { useState } from "react";

// DatePicker
import DatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

export default function UpdateCertificationDialog({ open, setOpen }) {
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
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      certifications: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });
  useEffect(() => {
    if (open) {
      reset({
        certifications:
          user?.profile?.certifications?.length > 0
            ? user.profile.certifications
            : [
                {
                  name: "",
                  organization: "",
                  dateIssued: "",
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
        { certifications: data.certifications },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Certifications updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update certifications!"
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
            <Award className="text-[#6A38C2]" size={20} />
            Update Certifications
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Add, edit, or remove your certifications and issued dates below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative border border-gray-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-4"
              >
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                  title="Remove"
                >
                  <Trash2 size={18} />
                </button>

                {/* Name */}
                <div className="space-y-1">
                  <Label>Certification Name</Label>
                  <Input
                    {...register(`certifications.${index}.name`)}
                    placeholder="e.g. Google Cloud Architect"
                  />
                  {errors.certifications?.[index]?.name && (
                    <p className="text-xs text-red-500">
                      {errors.certifications[index].name.message}
                    </p>
                  )}
                </div>

                {/* Organization */}
                <div className="space-y-1">
                  <Label>Issuing Organization</Label>
                  <Input
                    {...register(`certifications.${index}.organization`)}
                    placeholder="e.g. Google, AWS, Microsoft"
                  />
                  {errors.certifications?.[index]?.organization && (
                    <p className="text-xs text-red-500">
                      {errors.certifications[index].organization.message}
                    </p>
                  )}
                </div>

                {/* Date Picker */}
                <div className="space-y-1">
                  <Label>Date Issued</Label>
                  <Controller
                    control={control}
                    name={`certifications.${index}.dateIssued`}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value ? parseISO(field.value) : null}
                        onChange={(date) =>
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        }
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select issue date"
                        className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-[#6A38C2]/50 focus:border-[#6A38C2]"
                        locale={vi}
                      />
                    )}
                  />
                  {errors.certifications?.[index]?.dateIssued && (
                    <p className="text-xs text-red-500">
                      {errors.certifications[index].dateIssued.message}
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
              onClick={() =>
                append({
                  name: "",
                  organization: "",
                  dateIssued: "",
                })
              }
              className="flex items-center gap-2 border-[#6A38C2]/30 text-[#6A38C2]"
            >
              <Plus size={16} /> Add Certification
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
