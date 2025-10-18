import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);

  // Optional: validate token before showing form
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
        toast.success("✅ Password reset successfully!");
        form.reset();
        setTimeout(() => navigate("/login"), 2500);
      } else {
        toast.error(res.data.message || "Password reset failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired link.");
      setValidToken(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md transition-all">
        {validToken ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              🔐 Reset Your Password
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Enter your new password below to secure your account.
            </p>

            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6A38C2] hover:bg-[#5B30A6] text-white font-semibold mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center text-center space-y-3 py-10">
            <XCircle className="text-red-500 h-12 w-12 mb-2" />
            <h2 className="text-xl font-semibold text-gray-700">
              Invalid or Expired Link
            </h2>
            <p className="text-gray-500">
              The reset link you used is invalid or has expired.
            </p>
            <Button
              onClick={() => navigate("/forgot-password")}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Request New Link
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
