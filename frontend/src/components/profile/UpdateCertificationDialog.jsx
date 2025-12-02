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
import { Award, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import DatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const certificationSchema = z.object({
  certifications: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      organization: z.string().min(1, "Organization is required"),
      dateIssued: z.string().optional(),
      expirationDate: z.string().optional(),
      url: z.string().optional(),
    })
  ),
});

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
    defaultValues: { certifications: [] },
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
            ? user.profile.certifications.map((cert) => ({
                ...cert,
                dateIssued: cert.dateIssued
                  ? cert.dateIssued.split("T")[0]
                  : "",
                expirationDate: cert.expirationDate
                  ? cert.expirationDate.split("T")[0]
                  : "",
              }))
            : [
                {
                  name: "",
                  organization: "",
                  dateIssued: "",
                  expirationDate: "",
                  url: "",
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
        toast.success("Certifications updated!");
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
      <DialogContent className="max-w-2xl bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Award className="text-[#6A38C2]" size={20} /> Update Certifications
          </DialogTitle>
          <DialogDescription>Manage your certifications.</DialogDescription>
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
                  <Label>Name</Label>
                  <Input
                    {...register(`certifications.${index}.name`)}
                    placeholder="e.g. AWS Certified"
                  />
                  {errors.certifications?.[index]?.name && (
                    <p className="text-xs text-red-500">
                      {errors.certifications[index].name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Organization</Label>
                  <Input
                    {...register(`certifications.${index}.organization`)}
                    placeholder="e.g. Amazon"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Credential URL</Label>
                  <Input
                    {...register(`certifications.${index}.url`)}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Date Issued</Label>
                    <Controller
                      control={control}
                      name={`certifications.${index}.dateIssued`}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value ? parseISO(field.value) : null}
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
                    <Label>Expiration Date</Label>
                    <Controller
                      control={control}
                      name={`certifications.${index}.expirationDate`}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value ? parseISO(field.value) : null}
                          onChange={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : ""
                            )
                          }
                          dateFormat="dd-MM-yyyy"
                          placeholderText="No expiration"
                          className="w-full border border-gray-200 rounded-md px-3 py-2"
                        />
                      )}
                    />
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
                  name: "",
                  organization: "",
                  dateIssued: "",
                  expirationDate: "",
                  url: "",
                })
              }
              className="text-[#6A38C2]"
            >
              <Plus size={16} /> Add
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
