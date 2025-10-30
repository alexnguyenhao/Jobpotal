import React, { useState } from "react";
import NavBar from "@/components/shared/NavBar.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/signupSchema";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";

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

  const onSubmit = async (data) => {
    try {
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
        toast.success("Registration successful!", {
          description: "Check your email to verify your account.",
        });
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <NavBar />

      <main className="flex-grow flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-10">
            <h2 className="text-3xl font-bold mb-4">Welcome to JobPortal 🚀</h2>
            <p className="text-sm text-indigo-100 text-center">
              Join thousands of students and recruiters connecting through our
              platform.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            {!role ? (
              <div className="text-center space-y-8">
                <h2 className="text-3xl font-bold text-gray-800">
                  Create Your Account
                </h2>
                <p className="text-gray-600">
                  Please select your account type:
                </p>
                <div className="flex justify-center gap-6 mt-4">
                  <Button
                    className="px-8 py-4 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                    onClick={() => form.setValue("role", "student")}
                  >
                    🎓 Student
                  </Button>
                  <Button
                    className="px-8 py-4 text-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                    onClick={() => form.setValue("role", "recruiter")}
                  >
                    🏢 Recruiter
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {role === "student"
                        ? "Student Registration"
                        : "Recruiter Registration"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => form.setValue("role", "")}
                      className="text-sm text-indigo-500 hover:underline"
                    >
                      ← Back
                    </button>
                  </div>

                  {/* Full Name */}
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

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
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
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pr-10"
                            />
                            <div
                              onClick={() => setShowPassword((p) => !p)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 cursor-pointer"
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Gender */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <div className="flex gap-4 mt-2">
                            {["male", "female", "other"].map((g) => (
                              <label
                                key={g}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition ${
                                  field.value === g
                                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                    : "border-gray-300 text-gray-600 hover:border-indigo-300"
                                }`}
                              >
                                <input
                                  type="radio"
                                  value={g}
                                  checked={field.value === g}
                                  onChange={() => field.onChange(g)}
                                  className="hidden"
                                />
                                <span className="capitalize font-medium">
                                  {g}
                                </span>
                              </label>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Student-only fields */}
                  {role === "student" && (
                    <>
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="+84 123456789"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="123 Main St, City"
                                  {...field}
                                />
                              </FormControl>
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
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormItem>
                        <FormLabel>Profile Picture</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              form.setValue("file", e.target.files?.[0])
                            }
                            className="border border-dashed border-gray-300 hover:border-indigo-400"
                          />
                        </FormControl>
                      </FormItem>
                    </>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 bg-[#6A38C2] hover:bg-[#5B30A6] text-white font-semibold py-2 rounded-lg transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Creating account...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>

                  <p className="text-center text-gray-500 text-sm mt-4">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Log in
                    </Link>
                  </p>
                </form>
              </Form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
