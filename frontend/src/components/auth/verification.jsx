import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

// Utils
import { USER_API_END_POINT } from "@/utils/constant";

// Components
import { Button } from "@/components/ui/button";

// Icons
import { CheckCircle2, XCircle, Loader2, MailCheck } from "lucide-react";

const Verification = () => {
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.get(
          `${USER_API_END_POINT}/verify-email?token=${token}`
        );
        if (res.data.success) {
          setStatus("success");
          toast.success("Your email has been verified successfully!");
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Verification failed.";
        setStatus("error");
        toast.error(errorMessage);
      }
    };

    // Giả lập delay 1 chút để user thấy loading state (tùy chọn)
    const timer = setTimeout(() => {
      verifyEmail();
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Loader2 size={32} className="animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Email
            </h2>
            <p className="text-gray-500">
              Please wait while we verify your email address...
            </p>
          </div>
        );
      case "success":
        return (
          <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verified!</h2>
            <p className="text-gray-500 mb-6">
              Your email has been successfully verified. You will be redirected
              to login shortly.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="bg-[#6A38C2] hover:bg-[#5B30A6] text-white rounded-xl w-full"
            >
              Go to Login
            </Button>
          </div>
        );
      case "error":
        return (
          <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
              <XCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-500 mb-6">
              The verification link is invalid or has expired. Please request a
              new verification email.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <Button
                onClick={() => navigate("/signup")}
                className="bg-[#6A38C2] hover:bg-[#5B30A6] text-white rounded-xl w-full"
              >
                Back to Signup
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="border-gray-200 hover:bg-gray-50 rounded-xl w-full"
              >
                Go to Login
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 md:p-10 relative overflow-hidden text-center">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-0" />
        <div className="absolute top-0 left-0 w-20 h-20 bg-indigo-50 rounded-br-full -z-0" />

        <div className="relative z-10">
          {/* Top Icon (Static) */}
          {status === "loading" && (
            <div className="mb-6 flex justify-center">
              <div className="w-12 h-12 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                <MailCheck size={24} />
              </div>
            </div>
          )}

          {renderContent()}
        </div>
      </div>

      <p className="mt-8 text-gray-400 text-sm">
        © {new Date().getFullYear()} JobPortal. All rights reserved.
      </p>
    </div>
  );
};

export default Verification;
