import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "sonner";

// Icons
import {
  LogOut,
  Bell,
  Search,
  Menu,
  CheckCheck,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { setUser, logout } from "@/redux/authSlice";
import { addNotification } from "@/redux/notificationSlice";
import { ADMIN_API_END_POINT } from "@/utils/constant";
import useGetAllNotification from "@/hooks/useGetAllNotification";
import useNotificationActions from "@/hooks/useNotificationActions";

const AdminHeader = ({ setIsSidebarOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const { notifications = [] } = useSelector((store) => store.notification);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const { readAll, readById, deleteNotice } = useNotificationActions();
  useGetAllNotification();
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  useEffect(() => {
    if (!user) return;

    socketRef.current = io("http://localhost:8000", {
      withCredentials: true,
      query: { userId: user._id },
      transports: ["websocket"],
    });

    socketRef.current.on("newNotification", (notification) => {
      toast.info(notification.message);
      dispatch(addNotification(notification));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user, dispatch]);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${ADMIN_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        socketRef.current?.disconnect();
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
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1.5 w-64 md:w-96">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search users, jobs..."
            className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full text-gray-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-500 hover:text-[#6A38C2]"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-80 p-0 bg-white shadow-xl rounded-xl border border-gray-100 mr-6"
            align="end"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50 rounded-t-xl">
              <h4 className="font-semibold text-gray-900">Notifications</h4>
              {unreadCount > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-500 hover:text-[#6A38C2]"
                        onClick={readAll}
                      >
                        <CheckCheck size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mark all as read</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-3">
                    <Bell className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No notifications yet</p>
                </div>
              ) : (
                notifications.map((noti) => (
                  <div
                    key={noti._id}
                    onClick={() => !noti.isRead && readById(noti._id)}
                    className={`group relative p-3 flex gap-3 border-b last:border-0 transition-colors cursor-pointer hover:bg-gray-50 ${
                      !noti.isRead ? "bg-purple-50/60" : "bg-white"
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`p-1.5 rounded-full ${
                          noti.type === "application_status"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {noti.type === "application_status" ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <AlertCircle size={14} />
                        )}
                      </div>
                    </div>

                    {/* Content Text */}
                    <div className="flex-1 min-w-0 pr-6">
                      <p
                        className={`text-sm ${
                          !noti.isRead
                            ? "font-semibold text-gray-900"
                            : "text-gray-700"
                        } leading-snug break-words`}
                      >
                        {noti.message}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {new Date(noti.createdAt).toLocaleString([], {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>

                    <div className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotice(noti._id);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>

                    {!noti.isRead && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#6A38C2] group-hover:opacity-0 transition-opacity" />
                    )}
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-8 w-px bg-gray-200 mx-1"></div>

        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.fullName || "Admin"}
                </p>
                <p className="text-xs text-gray-500">Admin</p>
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
