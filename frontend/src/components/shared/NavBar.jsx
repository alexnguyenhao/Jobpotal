import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

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
  Heart,
  Trash2,
  CheckCheck,
  Settings,
  MessageCircle,
} from "lucide-react";

// Components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Constants & Redux
import { USER_API_END_POINT } from "@/utils/constant.js";
import { setUser, logout, setLoading } from "@/redux/authSlice.js";
import { clearCVState } from "@/redux/cvSlice";

// Hooks
import useGetAllNotification from "@/hooks/useGetAllNotification";
import useNotificationActions from "@/hooks/useNotificationActions";
import { useSocketContext } from "@/context/SocketContext";

const NavBar = () => {
  const { user, loading, isAuthenticated } = useSelector((s) => s.auth);
  const { notifications = [] } = useSelector((s) => s.notification);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { readAll, readById, deleteNotice } = useNotificationActions();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const hasFetched = useRef(false);

  const { socket } = useSocketContext();

  useGetAllNotification();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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

        if (res.data.success) dispatch(setUser(res.data.user));
        else dispatch(logout());
      } catch {
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkUser();
  }, [dispatch, isAuthenticated]);

  const logoutHandler = async () => {
    setIsLoggingOut(true);

    try {
      await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      dispatch(logout());
      dispatch(clearCVState());

      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    } finally {
      setIsLoggingOut(false);
      setIsMenuOpen(false);
    }
  };

  const recruiterLinks = [
    { path: "/recruiter/companies", label: "Companies", icon: Building2 },
    { path: "/recruiter/jobs", label: "Jobs", icon: Briefcase },
  ];

  const studentLinks = [
    { path: "/", label: "Home", icon: LayoutGrid },
    { path: "/jobs", label: "Find Jobs", icon: Briefcase },
    { path: "/browse", label: "Browse", icon: LayoutGrid },
    { path: "/cv/home", label: "CV Builder", icon: FileText },
    { path: "/career-guides", label: "Career Guide", icon: BookOpen },
  ];

  const navLinks = user?.role === "recruiter" ? recruiterLinks : studentLinks;
  const homeRoute = user?.role === "recruiter" ? "/recruiter/companies" : "/";

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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-gray-600 hover:text-[#6A38C2]"
                    >
                      <Bell size={22} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <Link to="/chat">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-gray-600 hover:text-[#6A38C2]"
                    >
                      <MessageCircle size={22} />
                    </Button>
                  </Link>

                  <PopoverContent
                    className="w-80 p-0 bg-white shadow-xl rounded-xl border border-gray-100"
                    align="end"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50 rounded-t-xl">
                      <h4 className="font-semibold text-gray-900">
                        Notifications
                      </h4>
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
                          <p className="text-sm text-gray-500">
                            No notifications yet
                          </p>
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

                            {/* Content */}
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

                            <div className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-0 opacity-100">
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

                {/* USER AVATAR */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar className="cursor-pointer w-9 h-9 ring-2 ring-offset-2 ring-transparent hover:ring-[#6A38C2]/20 transition-all">
                      <AvatarImage
                        src={user?.profilePhoto}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-[#6A38C2] text-white">
                        {user?.fullName?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>

                  <PopoverContent className="w-60 p-2 mr-4" align="end">
                    <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-100 mb-1">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user?.profilePhoto} />
                        <AvatarFallback>{user?.fullName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-semibold text-gray-900 truncate text-sm">
                          {user?.fullName}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {user?.role}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-0.5 mt-2">
                      {user?.role === "student" && (
                        <>
                          <div>
                            <h1 className="font-semibold text-gray-900 text-sm">
                              Manage Account
                            </h1>
                            <Link
                              to="/profile"
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#6A38C2] rounded-md transition-colors"
                            >
                              <User2 size={16} /> Profile
                            </Link>
                            <Link
                              to="/setting-account"
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#6A38C2] rounded-md transition-colors"
                            >
                              <Settings size={16} /> Setting Account
                            </Link>
                          </div>
                          <div>
                            <h1 className="font-semibold text-gray-900 text-sm">
                              Manage CV
                            </h1>
                            <Link
                              to="/cv/list"
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#6A38C2] rounded-md transition-colors"
                            >
                              <FileText size={16} /> CV List
                            </Link>
                          </div>
                          <div>
                            <h1 className="font-semibold text-gray-900 text-sm">
                              Manage Job
                            </h1>
                            <Link
                              to="/saved-jobs"
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#6A38C2] rounded-md transition-colors"
                            >
                              <Heart size={16} /> Saved Jobs
                            </Link>
                            <Link
                              to="/applied-jobs"
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#6A38C2] rounded-md transition-colors"
                            >
                              <Briefcase size={16} /> Applied Jobs
                            </Link>
                          </div>
                          <div>
                            <h1 className="font-semibold text-gray-900 text-sm">
                              Notifications
                            </h1>
                            <Link
                              to="/notifications"
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#6A38C2] rounded-md transition-colors"
                            >
                              <Bell size={16} /> Notifications
                            </Link>
                          </div>
                          <div>
                            <h1 className="font-semibold text-gray-900 text-sm">
                              Chat
                            </h1>
                            <Link
                              to="/chat"
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#6A38C2] rounded-md transition-colors"
                            >
                              <MessageCircle size={16} /> Chat
                            </Link>
                          </div>
                        </>
                      )}
                      {user?.role === "recruiter" && (
                        <>
                          <Link
                            to="/notifications"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#6A38C2] rounded-md transition-colors"
                          >
                            <Bell size={16} /> Notifications
                          </Link>
                          <Link
                            to="/setting-account"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#6A38C2] rounded-md transition-colors"
                          >
                            <Settings size={16} /> Setting Account
                          </Link>
                        </>
                      )}
                      <button
                        onClick={logoutHandler}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors mt-1"
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
              <Link to="/notifications" className="relative">
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                )}
              </Link>
            )}
            {isAuthenticated && (
              <Link to="/chat">
                <MessageCircle size={22} />
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

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg absolute w-full">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  location.pathname === link.path
                    ? "bg-purple-50 text-[#6A38C2]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <link.icon size={18} /> {link.label}
              </Link>
            ))}

            <div className="h-px bg-gray-100"></div>

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
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                    >
                      <User2 size={18} /> Profile
                    </Link>

                    <Link
                      to="/saved-jobs"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                    >
                      <Heart size={18} /> Saved Jobs
                    </Link>

                    <Link
                      to="/applied-jobs"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                    >
                      <Briefcase size={18} /> Applied Jobs
                    </Link>
                  </>
                )}

                <button
                  onClick={logoutHandler}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
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
