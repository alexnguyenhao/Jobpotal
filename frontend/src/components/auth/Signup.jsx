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
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const [input, setInput] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    file: null,
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // ✅ Validate cơ bản
    if (!input.fullName || !input.email || !input.password || !input.gender) {
      toast.error("Please fill in name, email, password, and gender.");
      return;
    }

    // ✅ Validate cho student
    if (role === "student") {
      if (
        !input.phoneNumber ||
        !input.address ||
        !input.dateOfBirth ||
        !input.file
      ) {
        toast.error("Please complete all student information.");
        return;
      }
    }

    // ✅ Chuẩn bị dữ liệu
    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    formData.append("role", role);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Registration successful!", {
          description: "Check your email to verify your account.",
        });
        setTimeout(() => navigate("/login"), 2000);
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
          {/* Left side */}
          <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-10">
            <h2 className="text-3xl font-bold mb-4">Welcome to JobPortal 🚀</h2>
            <p className="text-sm text-indigo-100 text-center">
              Join thousands of students and recruiters connecting through our
              platform.
            </p>
          </div>

          {/* Right side */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            {!role ? (
              // ======================
              //  STEP 1: SELECT ROLE
              // ======================
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
                    onClick={() => setRole("student")}
                  >
                    🎓 Student
                  </Button>
                  <Button
                    className="px-8 py-4 text-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                    onClick={() => setRole("recruiter")}
                  >
                    🏢 Recruiter
                  </Button>
                </div>
              </div>
            ) : (
              // ======================
              //  STEP 2: FORM REGISTER
              // ======================
              <form onSubmit={submitHandler} className="space-y-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {role === "student"
                      ? "Student Registration"
                      : "Recruiter Registration"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setRole("")}
                    className="text-sm text-indigo-500 hover:underline"
                  >
                    ← Back
                  </button>
                </div>

                {/* Full Name */}
                <div>
                  <Label>Full Name</Label>
                  <Input
                    name="fullName"
                    value={input.fullName}
                    onChange={changeEventHandler}
                    placeholder="John Doe"
                    className="mt-1"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    value={input.email}
                    onChange={changeEventHandler}
                    placeholder="you@example.com"
                    className="mt-1"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Label>Password</Label>
                  <Input
                    name="password"
                    value={input.password}
                    onChange={changeEventHandler}
                    placeholder="••••••••"
                    className="mt-1 pr-10"
                    type={showPassword ? "text" : "password"}
                  />
                  <div
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-1 text-gray-500 hover:text-indigo-600 cursor-pointer transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>

                {/* Gender (CÓ CHO CẢ 2 ROLE) */}
                <div>
                  <Label>Gender</Label>
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

                {/* Student-only fields */}
                {role === "student" && (
                  <>
                    <div>
                      <Label>Phone Number</Label>
                      <Input
                        name="phoneNumber"
                        type="tel"
                        value={input.phoneNumber}
                        onChange={changeEventHandler}
                        placeholder="+84 123456789"
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Address</Label>
                        <Input
                          name="address"
                          value={input.address}
                          onChange={changeEventHandler}
                          placeholder="123 Main St, City"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Date of Birth</Label>
                        <Input
                          name="dateOfBirth"
                          type="date"
                          value={input.dateOfBirth}
                          onChange={changeEventHandler}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Profile Picture</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={changeFileHandler}
                        className="mt-1 border border-dashed border-gray-300 hover:border-indigo-400 transition"
                      />
                    </div>
                  </>
                )}

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
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
