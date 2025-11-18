import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

// Constants
import { USER_API_END_POINT } from "@/utils/constant";

// Components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Icons
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validate token (Optional - just visual check here)
  useEffect(() => {
    if (!token) {
      setValidToken(false);
    }
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password || !confirm) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/reset-password`, {
        token,
        newPassword: password,
      });

      if (res.data.success) {
        setIsSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast.error(res.data.message || "Password reset failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired link.");
      // Nếu lỗi do token sai/hết hạn thì setValidToken(false)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 md:p-10 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-0" />

        {/* --- SUCCESS STATE --- */}
        {isSuccess ? (
          <div className="flex flex-col items-center text-center py-10 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password Reset!
            </h2>
            <p className="text-gray-500 mb-6">
              Your password has been successfully updated. You will be
              redirected to login shortly.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="bg-[#6A38C2] hover:bg-[#5B30A6] text-white rounded-xl w-full"
            >
              Go to Login Now
            </Button>
          </div>
        ) : (
          /* --- FORM STATE --- */
          <div className="relative z-10">
            {!validToken ? (
              // INVALID TOKEN STATE
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Invalid Link
                </h2>
                <p className="text-gray-500 mb-6 text-sm">
                  The password reset link is invalid or has expired. Please
                  request a new one.
                </p>
                <Button
                  onClick={() => navigate("/forgot-password")}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 w-full"
                >
                  Request New Link
                </Button>
              </div>
            ) : (
              // RESET FORM
              <>
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-[#6A38C2]">
                  <Lock size={28} />
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Reset Password
                </h2>
                <p className="text-gray-500 mb-8">
                  Enter your new password below to secure your account.
                </p>

                <form onSubmit={handleReset} className="space-y-5">
                  {/* New Password */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 bg-gray-50 border-gray-200 focus:bg-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Re-enter password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="h-12 bg-gray-50 border-gray-200 focus:bg-white pr-10"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#6A38C2] hover:bg-[#5B30A6] text-white font-bold rounded-xl text-base shadow-lg shadow-purple-200 transition-all mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
