import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { USER_API_END_POINT } from "@/utils/constant";
import { loginSchema } from "@/lib/loginSchema";
import { setLoading, setUser } from "@/redux/authSlice";
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
  Eye, 
  EyeOff, 
  Loader2, 
  User, 
  KeyRound, 
  ShieldCheck, 
  ArrowLeft 
} from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [requires2FA, setRequires2FA] = useState(false); 
  const [tempUserId, setTempUserId] = useState(""); 
  const [otp, setOtp] = useState(""); 

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

      if (res.data.require2FA) {
        setRequires2FA(true);
        setTempUserId(res.data.userId);
        toast.info(res.data.message || "Please enter the OTP sent to your email.");
      } 
      else if (res.data.success) {
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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP code.");

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/verify-otp`, 
        { userId: tempUserId, otp },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user)); 
        toast.success(`Welcome back, ${res.data.user.fullName}!`);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      dispatch(setLoading(false));
    }
  };


  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar />

      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-gray-100">
          <div className="hidden lg:flex flex-col justify-center items-start p-12 bg-[#6A38C2] text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 space-y-6">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold leading-tight">
                Welcome Back!
              </h2>
              <p className="text-indigo-100 text-lg max-w-md leading-relaxed">
                To keep connected with us please login with your personal info.
                <br />
                Let's get you to your dream job.
              </p>
            </div>
          </div>


          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            
            
            {!requires2FA ? (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Login Account
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Please login to continue to your dashboard.
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="email"
                                placeholder="name@example.com"
                                className="h-12 bg-gray-50 border-gray-200 focus:bg-white pl-10"
                                {...field}
                              />
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel>Password</FormLabel>
                            <Link to="/forgot-password" className="text-xs font-medium text-[#6A38C2] hover:underline">
                              Forgot password?
                            </Link>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="h-12 bg-gray-50 border-gray-200 focus:bg-white pl-10 pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Login as</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-2 gap-4">
                              {["student", "recruiter"].map((r) => (
                                <label
                                  key={r}
                                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                                    field.value === r
                                      ? "border-[#6A38C2] bg-purple-50 text-[#6A38C2] font-semibold"
                                      : "border-gray-200 text-gray-600 hover:border-purple-200 hover:bg-gray-50"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    value={r}
                                    checked={field.value === r}
                                    onChange={() => field.onChange(r)}
                                    className="hidden"
                                  />
                                  <span className="capitalize">{r}</span>
                                </label>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-[#6A38C2] hover:bg-[#5B30A6] text-white font-bold rounded-xl text-base shadow-lg shadow-purple-200 transition-all mt-4"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>

                    <p className="text-center text-sm text-gray-500">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-[#6A38C2] font-bold hover:underline">
                        Sign up
                      </Link>
                    </p>
                  </form>
                </Form>
              </>
            ) : (
              <div className="fade-in animate-in slide-in-from-right-8 duration-500">
                 <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8 text-[#6A38C2]" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Two-Factor Auth
                    </h2>
                    <p className="text-gray-500 mt-2">
                        We sent a code to your email. Enter it below to access your account.
                    </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="space-y-2">
                         <div className="relative">
                            <Input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6-digit OTP code"
                                className="h-14 text-center text-2xl tracking-widest font-bold bg-gray-50 border-gray-200 focus:bg-white"
                                maxLength={6}
                            />
                        </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-[#6A38C2] hover:bg-[#5B30A6] text-white font-bold rounded-xl text-base shadow-lg shadow-purple-200 transition-all"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...
                        </>
                      ) : (
                        "Verify & Login"
                      )}
                    </Button>
                    
                    <div className="text-center">
                        <button 
                            type="button"
                            onClick={() => setRequires2FA(false)}
                            className="text-sm text-gray-500 hover:text-[#6A38C2] flex items-center justify-center gap-1 mx-auto"
                        >
                            <ArrowLeft size={16}/> Back to Login
                        </button>
                    </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;