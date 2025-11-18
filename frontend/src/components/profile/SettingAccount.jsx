import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant.js";

// Components
import { Label } from "@/components/ui/label.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";

// Icons
import { Loader2, Lock, Eye, EyeOff, Save } from "lucide-react";

const SettingAccount = () => {
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // State hiển thị password riêng biệt cho từng ô
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/change-password`, // Route đổi pass
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Lock className="text-[#6A38C2]" size={20} /> Security Settings
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your password and account security preferences.
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

      {/* Optional: Delete Account Zone */}
      <div className="mt-8 bg-red-50 border border-red-100 rounded-2xl p-6">
        <h3 className="text-red-700 font-bold text-lg mb-2">Danger Zone</h3>
        <p className="text-red-600/80 text-sm mb-4">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <Button
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700 hover:border-red-300"
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default SettingAccount;
