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
import { setLoading } from "@/redux/authSlice.js";

const Signup = () => {
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    role: "",
    file: null,
  });

  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      !input.fullName ||
      !input.email ||
      !input.phoneNumber ||
      !input.password ||
      !input.address ||
      !input.dateOfBirth ||
      !input.gender ||
      !input.role ||
      !input.file
    ) {
      toast.error("Please complete all fields and upload a photo.");
      return;
    }

    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) =>
      formData.append(key, value)
    );

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Email verification required", {
          description: "Please check your inbox to verify your email address.",
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
          {/* Left side (Illustration / CTA) */}
          <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-10">
            <h2 className="text-3xl font-bold mb-4">Welcome to JobPortal 🚀</h2>
            <p className="text-sm text-indigo-100 mb-8 text-center">
              Join thousands of students and recruiters connecting through our
              platform.
            </p>
          </div>

          {/* Right side (Form) */}
          <div className="p-8 md:p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Create Your Account
            </h2>

            <form onSubmit={submitHandler} className="space-y-5">
              {/* Full Name */}
              <div>
                <Label className="text-gray-700">Full Name</Label>
                <Input
                  name="fullName"
                  value={input.fullName}
                  onChange={changeEventHandler}
                  placeholder="John Doe"
                  className="mt-1"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    value={input.email}
                    onChange={changeEventHandler}
                    placeholder="you@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Phone Number</Label>
                  <Input
                    name="phoneNumber"
                    type="tel"
                    value={input.phoneNumber}
                    onChange={changeEventHandler}
                    placeholder="+84 123456789"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <Label className="text-gray-700">Password</Label>
                <Input
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  placeholder="••••••••"
                  className="mt-1 pr-10" // thêm padding phải để tránh icon che chữ
                  type={showPassword ? "text" : "password"} // chỉ toggle type, không toggle onClick
                />
                {/* Icon toggle */}
                <div
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-7 text-gray-500 hover:text-indigo-600 cursor-pointer transition"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </div>
              </div>

              {/* Address & DOB */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Address</Label>
                  <Input
                    name="address"
                    value={input.address}
                    onChange={changeEventHandler}
                    placeholder="123 Main St, City"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Date of Birth</Label>
                  <Input
                    name="dateOfBirth"
                    type="date"
                    value={input.dateOfBirth}
                    onChange={changeEventHandler}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <Label className="text-gray-700">Gender</Label>
                <div className="flex gap-4 mt-2">
                  {["male", "female", "other"].map((g) => (
                    <label
                      key={g}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition ${
                        input.gender === g
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-300 text-gray-600 hover:border-indigo-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={input.gender === g}
                        onChange={changeEventHandler}
                        className="hidden"
                      />
                      <span className="capitalize font-medium">{g}</span>
                    </label>
                  ))}
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

              {/* File */}
              <div>
                <Label className="text-gray-700">Profile Picture</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="mt-1 border border-dashed border-gray-300 hover:border-indigo-400 transition"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#6A38C2] hover:bg-[#5B30A6] text-white font-semibold py-2 rounded-lg transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                    account...
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
