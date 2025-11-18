import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Store & Utils
import { USER_API_END_POINT } from "@/utils/constant";
import { signupSchema } from "@/lib/signupSchema";
import { setLoading } from "@/redux/authSlice";

// Components
import NavBar from "@/components/shared/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Eye,
  EyeOff,
  Loader2,
  Briefcase,
  GraduationCap,
  ArrowLeft,
  UploadCloud,
} from "lucide-react";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "",
      fullName: "",
      email: "",
      password: "",
      gender: "",
      phoneNumber: "",
      address: "",
      dateOfBirth: "",
      file: null,
    },
  });

  const role = form.watch("role");
  // Watch file để hiện tên file
  const fileValue = form.watch("file");

  const onSubmit = async (data) => {
    try {
      // Validate thủ công cho Student
      if (data.role === "student") {
        if (!data.phoneNumber || !data.address || !data.dateOfBirth) {
          toast.error("Please complete all student information.");
          return;
        }
      }

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Registration successful!");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar />

      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-gray-100">
          {/* LEFT SIDE: BANNER */}
          <div className="hidden lg:flex flex-col justify-center items-start p-12 bg-[#6A38C2] text-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 space-y-6">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold leading-tight">
                Start your journey <br /> with{" "}
                <span className="text-yellow-300">JobPortal</span>
              </h2>
              <p className="text-indigo-100 text-lg max-w-md">
                Join thousands of students and recruiters connecting through our
                platform. Your dream career is just a click away.
              </p>

              <div className="flex items-center gap-4 mt-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-[#6A38C2] bg-gray-200"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-white/80">
                  Join 10k+ users
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: FORM */}
          <div className="p-8 md:p-12 lg:p-16 overflow-y-auto max-h-[90vh]">
            {/* STEP 1: ROLE SELECTION */}
            {!role ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Create Account
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Who are you registering as?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
                  <button
                    type="button"
                    onClick={() => form.setValue("role", "student")}
                    className="flex flex-col items-center p-6 border-2 border-gray-100 rounded-2xl hover:border-[#6A38C2] hover:bg-purple-50 transition-all group"
                  >
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <GraduationCap size={32} />
                    </div>
                    <span className="font-bold text-gray-800">Student</span>
                    <span className="text-xs text-gray-500 mt-1">
                      Looking for jobs
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => form.setValue("role", "recruiter")}
                    className="flex flex-col items-center p-6 border-2 border-gray-100 rounded-2xl hover:border-[#6A38C2] hover:bg-purple-50 transition-all group"
                  >
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Briefcase size={32} />
                    </div>
                    <span className="font-bold text-gray-800">Recruiter</span>
                    <span className="text-xs text-gray-500 mt-1">
                      Hiring talent
                    </span>
                  </button>
                </div>

                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#6A38C2] font-bold hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            ) : (
              /* STEP 2: REGISTRATION FORM */
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {role === "student"
                      ? "Student Sign Up"
                      : "Recruiter Sign Up"}
                  </h3>
                  <Button
                    variant="ghost"
                    onClick={() => form.setValue("role", "")}
                    className="text-gray-500 hover:text-[#6A38C2]"
                  >
                    <ArrowLeft size={18} className="mr-2" /> Back
                  </Button>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="name@example.com"
                              className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="h-11 bg-gray-50 border-gray-200 focus:bg-white pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? (
                                  <EyeOff size={18} />
                                ) : (
                                  <Eye size={18} />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* 2 Columns Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Phone (Student) */}
                      {role === "student" && (
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="+1 234 567 890"
                                  className="h-11 bg-gray-50 border-gray-200"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Gender (General) */}
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
                                <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
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
                    </div>

                    {/* Student Specific Fields */}
                    {role === "student" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  className="h-11 bg-gray-50 border-gray-200"
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
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="City, Country"
                                  className="h-11 bg-gray-50 border-gray-200"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* File Upload */}
                    <FormField
                      control={form.control}
                      name="file"
                      render={() => (
                        <FormItem>
                          <FormLabel>Profile Picture</FormLabel>
                          <FormControl>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
                              <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) =>
                                  form.setValue("file", e.target.files?.[0])
                                }
                              />
                              <div className="flex items-center justify-center gap-2 text-gray-500">
                                <UploadCloud size={20} />
                                <span className="text-sm font-medium">
                                  {fileValue
                                    ? fileValue.name
                                    : "Click to upload image"}
                                </span>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-[#6A38C2] hover:bg-[#5B30A6] text-white font-bold rounded-xl text-base shadow-lg shadow-purple-200 transition-all mt-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                          Creating Account...
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </Button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-[#6A38C2] font-bold hover:underline"
                      >
                        Log in
                      </Link>
                    </p>
                  </form>
                </Form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
