import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant.js";
import { setUser } from "@/redux/authSlice"; // ⚠️ Đảm bảo đường dẫn đúng tới file slice của bạn

// Components
import { Label } from "@/components/ui/label.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";

// Icons
import { 
  Loader2, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  ShieldCheck, 
  Smartphone 
} from "lucide-react";

const SettingAccount = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [loading2FA, setLoading2FA] = useState(false);
  
  // Password States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // --- XỬ LÝ ĐỔI PASSWORD ---
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/change-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // --- XỬ LÝ BẬT/TẮT 2FA ---
  const handleToggle2FA = async () => {
    setLoading2FA(true);
    // Xác định trạng thái muốn chuyển đổi (ngược lại với hiện tại)
    const newStatus = !user?.is2FAEnabled;

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/toggle-2fa`, // Route đã tạo ở bước trước
        { enable: newStatus },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedUser = { ...user, is2FAEnabled: newStatus };
        dispatch(setUser(updatedUser));
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update 2FA settings");
    } finally {
      setLoading2FA(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-[#6A38C2]" size={24} /> 
            Two-Factor Authentication
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Add an extra layer of security to your account.
          </p>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${user?.is2FAEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                    <Smartphone size={24} />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">
                        Email Authentication
                    </h3>
                    <p className="text-xs text-gray-500 max-w-[250px] sm:max-w-sm">
                        {user?.is2FAEnabled 
                            ? "Your account is secured. We will send an OTP to your email when you login."
                            : "Secure your account by requiring an OTP sent to your email during login."
                        }
                    </p>
                </div>
            </div>
            <button 
                onClick={handleToggle2FA}
                disabled={loading2FA}
                className={`
                    relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 
                    focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                    ${user?.is2FAEnabled ? 'bg-[#6A38C2]' : 'bg-gray-300'}
                    ${loading2FA ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <span className="sr-only">Use setting</span>
                <span
                    className={`
                        pointer-events-none block h-6 w-6 rounded-full bg-white shadow-lg ring-0 
                        transition-transform duration-200 ease-in-out
                        ${user?.is2FAEnabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                />
            </button>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Lock className="text-[#6A38C2]" size={20} /> 
            Change Password
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your password to keep your account safe.
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-6">
          {/* Old Password */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">
              Current Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                className="pl-10 pr-10 h-11"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="pl-10 pr-10 h-11"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Password must be at least 6 characters long.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={loading || !oldPassword || !newPassword}
              className="bg-[#6A38C2] hover:bg-[#592ba3] text-white px-6 h-11 font-semibold shadow-md flex items-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" /> Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingAccount;