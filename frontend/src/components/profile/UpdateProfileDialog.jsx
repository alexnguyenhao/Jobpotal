import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Store & Utils
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { updateProfileSchema } from "@/lib/updateProfileSchema";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Đảm bảo bạn đã có component này
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
import {
  Loader2,
  User2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Sparkles,
  Target,
  UploadCloud,
  X,
  Briefcase,
} from "lucide-react";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split("T")[0] : "", // Fix date format
      gender: user?.gender || "male",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
      bio: user?.bio || "",
      skills: user?.profile?.skills?.join(", ") || "",
      careerObjective: user?.profile?.careerObjective || "",
      file: null,
    },
  });

  // Watch file để hiển thị tên file khi chọn
  const fileValue = form.watch("file");

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "file") {
        if (data.file) formData.append("file", data.file);
      } else {
        // Tránh gửi giá trị null/undefined
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }
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
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] bg-white p-0 gap-0 rounded-2xl overflow-hidden flex flex-col">
        {/* --- HEADER --- */}
        <DialogHeader className="px-6 py-4 bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-full text-[#6A38C2]">
              <User2 size={20} />
            </div>
            Edit Personal Profile
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Update your personal details, bio, and resume to stand out.
          </DialogDescription>
        </DialogHeader>

        {/* --- SCROLLABLE FORM --- */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* SECTION 1: PERSONAL INFO */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                  <User2 size={16} className="text-[#6A38C2]" /> Personal
                  Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="johndoe@example.com"
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
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 234 567 890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* SECTION 2: PROFESSIONAL */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b pb-2 mt-2">
                  <Briefcase size={16} className="text-[#6A38C2]" />{" "}
                  Professional Info
                </h3>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Sparkles size={14} className="text-yellow-500" /> Bio
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[80px]"
                          placeholder="A short bio about yourself..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="careerObjective"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Target size={14} className="text-red-500" /> Career
                        Objective
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[80px]"
                          placeholder="What are your professional goals?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="React, Node.js, Design (comma separated)"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        Separate skills with commas (,)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* SECTION 3: RESUME UPLOAD */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b pb-2 mt-2">
                  <FileText size={16} className="text-[#6A38C2]" /> Resume / CV
                </h3>

                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-100 transition-colors relative group">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => form.setValue("file", e.target.files?.[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />

                  <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6 text-[#6A38C2]" />
                  </div>

                  {fileValue ? (
                    <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                      <FileText size={16} />
                      {fileValue.name}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent opening file dialog
                          form.setValue("file", null);
                        }}
                        className="z-30 p-1 hover:bg-red-100 rounded-full text-red-500 ml-2"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF (MAX. 5MB)
                      </p>
                      {user?.resume && (
                        <p className="text-xs text-blue-600 mt-3 font-medium bg-blue-50 px-3 py-1 rounded-full">
                          Current: {user.resumeOriginalName || "View Resume"}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* --- FOOTER --- */}
        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading}
            className="bg-[#6A38C2] hover:bg-[#592ba3] text-white min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
