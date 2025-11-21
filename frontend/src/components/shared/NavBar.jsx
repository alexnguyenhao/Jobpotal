import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { io } from "socket.io-client";

// Icons
import {
  LogOut,
  User2,
  Menu,
  X,
  Briefcase,
  LayoutGrid,
  FileText,
  BookOpen,
  Building2,
  Bell,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// Components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Constants & Redux
import { USER_API_END_POINT } from "@/utils/constant.js";
import { setUser, logout, setLoading } from "@/redux/authSlice.js";
import { clearCVState } from "@/redux/cvSlice";
import { setNotifications } from "@/redux/notificationSlice";

// --- IMPORT HOOK CỦA BẠN ---
import useGetAllNotification from "@/hooks/useGetAllNotification"; // Đảm bảo đường dẫn đúng file bạn vừa tạo

const NavBar = () => {
  const { user, loading, isAuthenticated } = useSelector((store) => store.auth);
  const { notifications = [] } = useSelector((store) => store.notification);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const hasFetched = useRef(false);
  const socketRef = useRef(null);

  // --- 1. GỌI HOOK LẤY THÔNG BÁO ---
  // Hook này sẽ tự chạy khi component mount và user đã login
  // Nó thay thế hoàn toàn cho useEffect gọi API thủ công trước đây
  useGetAllNotification();

  // Tính số lượng chưa đọc
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // --- 2. AUTH CHECK LOGIC ---
  useEffect(() => {
    if (hasFetched.current || isAuthenticated) return;
    const hasSessionCookie = document.cookie.includes("token=");

    if (!hasSessionCookie) {
      dispatch(logout());
      return;
    }

    hasFetched.current = true;
    const checkUser = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get(`${USER_API_END_POINT}/profile`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUser(res.data.user));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };
    checkUser();
  }, [dispatch, isAuthenticated]);

  // --- 3. SOCKET REAL-TIME (Vẫn giữ để nhận tin mới tức thì) ---
  useEffect(() => {
    if (!user) return;

    socketRef.current = io("http://localhost:8000", {
      withCredentials: true,
      query: { userId: user._id },
      transports: ["websocket"],
    });

    socketRef.current.on("newNotification", (notification) => {
      toast.info(notification.message);
      // Khi có tin mới qua socket, ta nối nó vào danh sách hiện có
      dispatch(setNotifications([notification, ...notifications]));
    });

    return () => {
      // if (socketRef.current) socketRef.current.disconnect();
    };
  }, [user, notifications, dispatch]);

  const logoutHandler = async () => {
    setIsLoggingOut(true);
    try {
      await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      dispatch(logout());
      dispatch(clearCVState());
      if (socketRef.current) socketRef.current.disconnect();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setIsLoggingOut(false);
      setIsMenuOpen(false);
    }
  };

  // Navigation Links Setup
  const recruiterLinks = [
    { path: "/admin/companies", label: "Companies", icon: Building2 },
    { path: "/admin/jobs", label: "Jobs", icon: Briefcase },
    { path: "/admin/career-guides", label: "Career Guides", icon: BookOpen },
  ];

  const studentLinks = [
    { path: "/", label: "Home", icon: LayoutGrid },
    { path: "/jobs", label: "Find Jobs", icon: Briefcase },
    { path: "/browse", label: "Browse", icon: LayoutGrid },
    { path: "/cv/home", label: "CV Builder", icon: FileText },
    { path: "/career-guides", label: "Career Guide", icon: BookOpen },
  ];

  const navLinks = user?.role === "recruiter" ? recruiterLinks : studentLinks;
  const homeRoute = user?.role === "recruiter" ? "/admin/companies" : "/";

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link
            to={homeRoute}
            className="flex-shrink-0 flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="bg-[#6A38C2] p-1.5 rounded-lg">
              <Briefcase className="text-white w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Job<span className="text-[#6A38C2]">Portal</span>
            </h1>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">
            {!loading && (
              <ul className="flex items-center space-x-6">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`text-sm font-medium transition-colors hover:text-[#6A38C2] ${
                        location.pathname === link.path
                          ? "text-[#6A38C2]"
                          : "text-gray-600"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#6A38C2] text-white">Signup</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {/* NOTIFICATION POPOVER */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-gray-600 hover:text-[#6A38C2] rounded-full"
                    >
                      <Bell size={22} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80 p-0 bg-white shadow-lg rounded-xl border border-gray-100"
                    align="end"
                  >
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-xl">
                      <h4 className="font-semibold text-gray-900">
                        Notifications
                      </h4>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm flex flex-col items-center justify-center h-32">
                          <Bell className="w-8 h-8 mb-2 text-gray-300" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-50">
                          {notifications.map((noti, index) => (
                            <div
                              key={index}
                              className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${
                                !noti.isRead ? "bg-purple-50/40" : ""
                              }`}
                            >
                              <div
                                className={`mt-1 p-1.5 rounded-full h-fit shrink-0 ${
                                  noti.type === "application_status"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {noti.type === "application_status" ? (
                                  <CheckCircle2 size={16} />
                                ) : (
                                  <AlertCircle size={16} />
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-800 leading-snug font-medium line-clamp-2">
                                  {noti.message}
                                </p>
                                <span className="text-[10px] text-gray-400 block">
                                  {new Date(noti.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* USER AVATAR */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar className="cursor-pointer w-9 h-9 ring-2 ring-transparent hover:ring-[#6A38C2]/20 transition-all">
                      <AvatarImage src={user?.profilePhoto} />
                      <AvatarFallback className="bg-purple-100 text-[#6A38C2] font-bold">
                        {user?.fullName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2">
                    <div className="px-2 py-1.5 border-b border-gray-100 mb-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate capitalize">
                        {user?.role}
                      </p>
                    </div>
                    <div className="space-y-1">
                      {user?.role === "student" && (
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                          <User2 size={16} /> View Profile
                        </Link>
                      )}
                      <button
                        onClick={logoutHandler}
                        className="w-full flex items-center gap-2 px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center gap-3">
            {isAuthenticated && (
              <Link to="/notifications" className="relative text-gray-600 p-1">
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg animate-in slide-in-from-top-5">
          <div className="px-4 py-6 space-y-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                    location.pathname === link.path
                      ? "bg-purple-50 text-[#6A38C2]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="h-px bg-gray-100 my-2"></div>
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  className="bg-[#6A38C2]"
                  onClick={() => {
                    navigate("/signup");
                    setIsMenuOpen(false);
                  }}
                >
                  Signup
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Mobile User Info */}
                <div className="flex items-center gap-3 px-4 py-2">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.profilePhoto} />
                    <AvatarFallback>{user?.fullName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
                {user?.role === "student" && (
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    <User2 size={18} /> Profile
                  </Link>
                )}
                <button
                  onClick={logoutHandler}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 text-left"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
