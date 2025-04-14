import React, { useState } from "react";
import NavBar from "@/components/shared/NavBar.jsx";
import { Label } from "@/components/ui/label.js";
import { Input } from "@/components/ui/input.js";
import { RadioGroup } from "@/components/ui/radio-group.js"; // Giữ RadioGroup để nhóm radio
import { Button } from "@/components/ui/button.js";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {COMPANY_API_END_POINT, USER_API_END_POINT} from "@/utils/constant.js";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice.js";

const Signup = () => {
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex flex-col pt-[100px]">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 sm:p-8 transform transition-all hover:shadow-xl">
          {/* Form Header */}
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
            Join Us Today
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Create an account to get started
          </p>

          {/* Signup Form */}
          <form onSubmit={submitHandler} className="space-y-5">
            {/* Full Name */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <Input
                type="text"
                placeholder="John Doe"
                value={input.fullName}
                onChange={changeEventHandler}
                name="fullName"
                className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              />
            </div>

            {/* Email */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                type="email"
                value={input.email}
                onChange={changeEventHandler}
                name="email"
                placeholder="you@example.com"
                className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              />
            </div>

            {/* Phone Number */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                type="tel"
                placeholder="+1 (123) 456-7890"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                name="phoneNumber"
                className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              />
            </div>

            {/* Password */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={input.password}
                onChange={changeEventHandler}
                name="password"
                className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              />
            </div>

            {/* Role Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                I am a...
              </Label>
              <RadioGroup
                value={input.role}
                onValueChange={(value) => setInput({ ...input, role: value })}
                className="mt-2 flex flex-col sm:flex-row gap-4"
              >
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    id="student"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeEventHandler}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <Label
                    htmlFor="student"
                    className="text-gray-600 cursor-pointer"
                  >
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    id="recruiter"
                    name="role"
                    value="recruiter"
                    checked={input.role === "recruiter"}
                    onChange={changeEventHandler}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <Label
                    htmlFor="recruiter"
                    className="text-gray-600 cursor-pointer"
                  >
                    Recruiter
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Profile Picture */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Profile Picture
              </Label>
              <Input
                accept="image/*"
                type="file"
                onChange={changeFileHandler}
                className="mt-1 w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>

            {loading ? (
              <Button className="w-full my-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4">
                Sign Up
              </Button>
            )}
          </form>

          {/* Footer Link */}
          <span className="mt-6 text-center text-sm text-gray-500 block">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:underline font-medium"
            >
              Log in
            </Link>
          </span>
        </div>
      </main>
    </div>
  );
};

export default Signup;
