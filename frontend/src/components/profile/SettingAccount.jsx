import React, { useState } from "react";
import { Label } from "@/components/ui/label.js";
import { Button } from "@/components/ui/button.js";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant.js";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice.js";

const SettingAccount = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccountSetting = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (newPassword) {
        const res = await axios.post(
          `${USER_API_END_POINT}/change-password`,
          {
            oldPassword,
            newPassword,
          },
          { withCredentials: true }
        );
        toast.success(res.data.message || "Password updated successfully!");
      }
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "An error occurred, please try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-lg">
      <h2 className="font-bold text-lg mb-4">Account Settings</h2>
      <form onSubmit={handleAccountSetting} className="flex flex-col gap-4">
        <div>
          <Label>Old Password</Label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border rounded px-3 py-2 mt-1"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div>
          <Label>New Password</Label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border rounded px-3 py-2 mt-1"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword((v) => !v)}
          />
          <span>Password Visibility</span>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#6A38C2] text-white"
        >
          {loading ? "Updating..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default SettingAccount;
