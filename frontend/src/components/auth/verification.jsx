import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { USER_API_END_POINT } from "@/utils/constant";
import { Button } from "@/components/ui/button";

const Verification = () => {
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const navigate = useNavigate();
  const location = useLocation();
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
        console.error(err);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">
              Verifying your email...
            </h2>
            <p className="text-gray-500 mt-2">Please wait a moment.</p>
          </>
        );
      case "success":
        return (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">
              Email Verified Successfully!
            </h2>
            <p className="text-gray-500 mt-2">
              Redirecting you to the login page...
            </p>
          </>
        );
      case "error":
        return (
          <>
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">
              Verification Failed
            </h2>
            <p className="text-gray-500 mt-2">
              Your verification link is invalid or expired.
            </p>
            <Button
              onClick={() => navigate("/signup")}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Back to Signup
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 text-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default Verification;
