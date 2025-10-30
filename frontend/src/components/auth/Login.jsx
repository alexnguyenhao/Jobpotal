import React, { useState } from "react";
import NavBar from "@/components/shared/NavBar.jsx";
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
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/loginSchema";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Setup react-hook-form + zod
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(`Welcome back, ${res.data.user.fullName || "User"}!`);
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
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
            <h2 className="text-3xl font-bold mb-4">Welcome Back 👋</h2>
            <p className="text-sm text-indigo-100 mb-8 text-center">
              Login to continue exploring job opportunities and career growth.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Login to Your Account
            </h2>

            {/* ✅ FORM START */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
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
                            onClick={() => setShowPassword((prev) => !prev)}
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
                      <div className="flex justify-end mt-1">
                        <Link
                          to="/forgot-password"
                          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>I am a...</FormLabel>
                      <FormControl>
                        <div className="flex gap-4 mt-2">
                          {["student", "recruiter"].map((r) => (
                            <label
                              key={r}
                              className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition ${
                                field.value === r
                                  ? "border-purple-500 bg-purple-50 text-purple-700"
                                  : "border-gray-300 text-gray-600 hover:border-purple-300"
                              }`}
                            >
                              <input
                                type="radio"
                                value={r}
                                checked={field.value === r}
                                onChange={() => field.onChange(r)}
                                className="hidden"
                              />
                              <span className="capitalize font-medium">
                                {r}
                              </span>
                            </label>
                          ))}
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
                  className="w-full mt-4 bg-[#6A38C2] hover:bg-[#5B30A6] text-white font-semibold py-2 rounded-lg transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging
                      in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Don’t have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </Form>
            {/* ✅ FORM END */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
