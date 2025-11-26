import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, Search, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { setUser, logout } from "@/redux/authSlice";
import { ADMIN_API_END_POINT } from "@/utils/constant";

const AdminHeader = ({ setIsSidebarOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${ADMIN_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(logout());
        dispatch(setUser(null));
        navigate("/admin/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button - Chỉ hiện ở màn hình nhỏ */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Search Bar (Optional) */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1.5 w-64 md:w-96">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search users, jobs..."
            className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full text-gray-700"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-500 hover:text-[#6A38C2]"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </Button>

        <div className="h-8 w-px bg-gray-200 mx-1"></div>

        {/* Profile Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.fullName || "Admin"}
                </p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <Avatar className="h-9 w-9 border border-gray-200">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            <div className="grid gap-1">
              <Button variant="ghost" className="justify-start text-sm">
                Profile Settings
              </Button>
              <div className="h-px bg-gray-100 my-1"></div>
              <Button
                variant="ghost"
                className="justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                onClick={logoutHandler}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default AdminHeader;
