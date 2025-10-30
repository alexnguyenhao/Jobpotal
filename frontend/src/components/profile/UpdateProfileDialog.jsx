import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  User2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Sparkles,
  Target,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@/lib/updateProfileSchema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
      bio: user?.bio || "",
      skills: user?.profile?.skills?.join(", ") || "",
      careerObjective: user?.profile?.careerObjective || "",
      file: null,
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-gradient-to-b from-white to-gray-50 border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <DialogHeader className="sticky top-0 bg-white z-10 pb-3 border-b">
          <DialogTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <User2 className="text-[#6A38C2]" size={20} />
            Update Profile
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Keep your personal and career details up to date.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="overflow-y-auto max-h-[65vh] px-1 mt-2 space-y-8"
          >
            {/* Personal Info */}
            <section>
              <h3 className="text-[#6A38C2] text-sm font-semibold mb-3 flex items-center gap-2 uppercase tracking-wide">
                <User2 size={14} /> Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-700">
                        <User2 size={16} className="text-[#6A38C2]" /> Full Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-700">
                        <Mail size={16} className="text-[#6A38C2]" /> Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-700">
                        <Phone size={16} className="text-[#6A38C2]" /> Phone
                        Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+1 234 567 890"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-700">
                        <MapPin size={16} className="text-[#6A38C2]" /> Address
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Professional Info */}
            <section>
              <h3 className="text-[#6A38C2] text-sm font-semibold mb-3 flex items-center gap-2 uppercase tracking-wide">
                <Target size={14} /> Professional Details
              </h3>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700">
                      <Sparkles size={16} className="text-[#6A38C2]" /> Bio
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A short introduction about yourself"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="careerObjective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700">
                      <FileText size={16} className="text-[#6A38C2]" /> Career
                      Objective
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Your professional goals" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700">
                      <Sparkles size={16} className="text-[#6A38C2]" /> Skills
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="React, Node.js, MongoDB" {...field} />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Separate skills with commas (,)
                    </p>
                  </FormItem>
                )}
              />

              {/* Resume Upload */}
              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700">
                      <FileText size={16} className="text-[#6A38C2]" /> Resume
                      (PDF)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) =>
                          form.setValue("file", e.target.files?.[0])
                        }
                        className="border-gray-200 focus:border-[#6A38C2]"
                      />
                    </FormControl>
                    {form.getValues("file") && (
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {typeof form.getValues("file") === "string"
                          ? form.getValues("file").split("/").pop()
                          : form.getValues("file")?.name}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </section>

            {/* Footer */}
            <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t mt-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6A38C2] hover:bg-[#592ba3] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
