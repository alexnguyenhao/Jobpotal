import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

// Constants
import { USER_API_END_POINT } from "@/utils/constant";

// UI Components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Icons
import { ArrowLeft, Mail, KeyRound, Loader2 } from "lucide-react";

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
      if (res.data.success) {
        toast.success(res.data.message || "Password reset link sent!");
        // Có thể điều hướng về trang login hoặc thông báo check mail
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      {/* Back Button */}
      <div className="w-full max-w-md mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/login")}
          className="text-gray-600 hover:text-[#6A38C2] pl-0 hover:bg-transparent transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Login
        </Button>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-100 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-0" />

        <div className="relative z-10">
          {/* Icon Header */}
          <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-[#6A38C2]">
            <KeyRound size={28} />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Don't worry! It happens. Please enter the email associated with your
            account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSending}
              className="w-full h-12 bg-[#6A38C2] hover:bg-[#5B30A6] text-white font-bold rounded-xl text-base shadow-lg shadow-purple-200 transition-all"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Footer Text */}
      <p className="mt-8 text-gray-500 text-sm text-center">
        Remember your password?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-[#6A38C2] font-bold cursor-pointer hover:underline"
        >
          Log in
        </span>
      </p>
    </div>
  );
};

export default ForgotPassword;
