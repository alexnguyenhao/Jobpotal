import React, { useState } from "react";
import NavBar from "@/components/shared/NavBar.jsx";
import { Label } from "@/components/ui/label.js";
import { Input } from "@/components/ui/input.js";
import { RadioGroup } from "@/components/ui/radio-group.js"; // Giữ RadioGroup để nhóm radio
import { Button } from "@/components/ui/button.js";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT, USER_API_END_POINT } from "@/utils/constant.js";
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
    address: "",
    dateOfBirth: "",
    // Mặc định là ngày
    gender: "",
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
    formData.append("address", input.address);
    formData.append("dateOfBirth", input.dateOfBirth); // Thay đổi nếu cần
    formData.append("gender", input.gender);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex flex-col">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Form Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Join Us Today
            </h1>
            <p className="text-gray-500">Create an account to get started</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={submitHandler} className="space-y-8">
            {/* Group: User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={input.fullName}
                  onChange={changeEventHandler}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={input.email}
                  onChange={changeEventHandler}
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  placeholder="+84 123456789"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={input.password}
                  onChange={changeEventHandler}
                />
              </div>
            </div>

            {/* Group: Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Address</Label>
                <Input
                  type="text"
                  name="address"
                  placeholder="123 Main St, City"
                  value={input.address}
                  onChange={changeEventHandler}
                />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  name="dateOfBirth"
                  value={input.dateOfBirth}
                  onChange={changeEventHandler}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Gender</Label>
                <RadioGroup
                  value={input.gender}
                  onValueChange={(value) =>
                    setInput({ ...input, gender: value })
                  }
                  className="mt-2 flex gap-6 flex-wrap"
                >
                  {["male", "female", "other"].map((g) => (
                    <div key={g} className="flex items-center space-x-2">
                      <Input
                        type="radio"
                        id={g}
                        name="gender"
                        value={g}
                        checked={input.gender === g}
                        onChange={changeEventHandler}
                      />
                      <Label htmlFor={g} className="capitalize">
                        {g}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Group: Role */}
            <div>
              <Label>I am a...</Label>
              <RadioGroup
                value={input.role}
                onValueChange={(value) => setInput({ ...input, role: value })}
                className="mt-2 flex gap-6 flex-wrap"
              >
                {["student", "recruiter"].map((r) => (
                  <div key={r} className="flex items-center space-x-2">
                    <Input
                      type="radio"
                      id={r}
                      name="role"
                      value={r}
                      checked={input.role === r}
                      onChange={changeEventHandler}
                    />
                    <Label htmlFor={r} className="capitalize">
                      {r}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Group: Upload */}
            <div>
              <Label>Profile Picture</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                className="file-input mt-1 w-full"
              />
            </div>

            {/* Submit Button */}
            <div>
              <Button type="submit" className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:underline font-medium"
            >
              Log in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
