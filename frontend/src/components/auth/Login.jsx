import React, { useState } from "react";
import NavBar from "@/components/shared/NavBar.jsx";
import { Label } from "@/components/ui/label.js";
import { Input } from "@/components/ui/input.js";
import { Button } from "@/components/ui/button.js";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant.js";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice.js";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.email || !input.password || !input.role) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(`Welcome back, ${res.data.user.fullName || "User"}!`);
        setTimeout(() => navigate("/"), 1200);
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
          {/* Left Side - Illustration */}
          <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-10">
            <h2 className="text-3xl font-bold mb-4">Welcome Back 👋</h2>
            <p className="text-sm text-indigo-100 mb-8 text-center">
              Login to continue exploring job opportunities and career growth.
            </p>
          </div>

          {/* Right Side - Login Form */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Login to Your Account
            </h2>

            <form onSubmit={submitHandler} className="space-y-5">
              {/* Email */}
              <div>
                <Label className="text-gray-700">Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="mt-1"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Label className="text-gray-700">Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={input.password}
                  onChange={changeEventHandler}
                  className="mt-1 pr-10"
                />
                {/* 👁 Show/Hide Password */}
                <div
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-8 transform -translate-y-1/2 mt-1 text-gray-500 hover:text-indigo-600 cursor-pointer transition"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </div>

                {/* 🔗 Forgot Password */}
                <div className="flex justify-end mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Role */}
              <div>
                <Label className="text-gray-700">I am a...</Label>
                <div className="flex gap-4 mt-2">
                  {["student", "recruiter"].map((r) => (
                    <label
                      key={r}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition ${
                        input.role === r
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-300 text-gray-600 hover:border-purple-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r}
                        checked={input.role === r}
                        onChange={changeEventHandler}
                        className="hidden"
                      />
                      <span className="capitalize font-medium">{r}</span>
                    </label>
                  ))}
                </div>
              </div>

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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
