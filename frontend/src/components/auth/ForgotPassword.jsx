import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowLeftRight } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email address");

    try {
      setIsSending(true);
      const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, {
        email,
      });
      toast.success(res.data.message || "Password reset link sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md">
        <ArrowLeft onClick={() => navigate(-1)} />
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Forgot Password
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Enter your registered email and we’ll send you a reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={isSending}
            className="w-full bg-[#6A38C2] hover:bg-[#5B30A6] text-white font-semibold"
          >
            {isSending ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
