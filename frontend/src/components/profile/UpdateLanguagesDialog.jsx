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
import { Plus, Trash2, Languages } from "lucide-react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { languageSchema } from "@/lib/languageSchema";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UpdateLanguagesDialog({ open, setOpen }) {
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
    resolver: zodResolver(languageSchema),
    defaultValues: { languages: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages",
  });

  useEffect(() => {
    if (open) {
      reset({
        languages:
          user?.profile?.languages?.length > 0
            ? user.profile.languages
            : [
                {
                  language: "",
                  proficiency: "",
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
        { languages: data.languages },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Languages updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update languages!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl bg-gradient-to-b from-white to-gray-50 shadow-xl border border-gray-100 rounded-2xl">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Languages className="text-[#6A38C2]" size={20} />
            Update Languages
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Add the languages you speak and your level of proficiency.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto mt-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-4 relative"
              >
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                  title="Remove language"
                  disabled={fields.length === 1}
                >
                  <Trash2 size={18} />
                </button>

                {/* Language Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Language
                  </Label>
                  <Input
                    {...register(`languages.${index}.language`)}
                    placeholder="e.g. English, Vietnamese"
                    className="border-gray-200 focus:ring-[#6A38C2]/50 focus:border-[#6A38C2]"
                  />
                  {errors.languages?.[index]?.language && (
                    <p className="text-xs text-red-500">
                      {errors.languages[index].language.message}
                    </p>
                  )}
                </div>

                {/* Proficiency */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Proficiency
                  </Label>

                  <Controller
                    control={control}
                    name={`languages.${index}.proficiency`}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="border-gray-200 focus:ring-[#6A38C2]/50 focus:border-[#6A38C2]">
                          <SelectValue placeholder="Select proficiency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Basic">Basic</SelectItem>
                          <SelectItem value="Conversational">
                            Conversational
                          </SelectItem>
                          <SelectItem value="Fluent">Fluent</SelectItem>
                          <SelectItem value="Native">Native</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.languages?.[index]?.proficiency && (
                    <p className="text-xs text-red-500">
                      {errors.languages[index].proficiency.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="flex justify-between mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ language: "", proficiency: "Beginner" })}
              className="flex items-center gap-2 border-[#6A38C2]/30 text-[#6A38C2]"
            >
              <Plus size={16} /> Add Language
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
