import React, { useState, useEffect, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { LogOut, User2, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant.js";
import { setUser, logout, setLoading } from "@/redux/authSlice.js";
import { toast } from "sonner";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, loading, isAuthenticated } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMenuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMenuOpen]);
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

  const logoutHandler = async () => {
    setIsLoggingOut(true);
    try {
      await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      dispatch(logout());
      toast.success("You have logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      setIsLoggingOut(false);
      setIsMenuOpen(false);
    }
  };
  const homeRoute = user?.role === "recruiter" ? "/admin/companies" : "/";

  return (
    <nav className="bg-white shadow-md w-full z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to={homeRoute} onClick={() => setIsMenuOpen(false)}>
          <h1 className="text-2xl font-bold tracking-tight select-none">
            Job
            <span className="text-[#6A38C2] hover:text-[#5B30A6] transition-colors">
              Portal
            </span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {!loading && (
            <ul className="flex items-center gap-6 font-medium text-gray-600">
              {user?.role === "recruiter" ? (
                <>
                  <li>
                    <Link
                      to="/admin/companies"
                      className="hover:text-[#5B30A6] transition-colors"
                    >
                      Companies
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/jobs"
                      className="hover:text-[#5B30A6] transition-colors"
                    >
                      Jobs
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/"
                      className="hover:text-[#5B30A6] transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/jobs"
                      className="hover:text-[#5B30A6] transition-colors"
                    >
                      Jobs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/browse"
                      className="hover:text-[#5B30A6] transition-colors"
                    >
                      Browse
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cv/home"
                      className="hover:text-[#5B30A6] transition-colors"
                    >
                      CV Builder
                    </Link>
                  </li>
                </>
              )}
            </ul>
          )}

          {/* ✅ Auth Buttons */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5B30A6] text-white font-semibold">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer w-10 h-10 ring-2 ring-gray-200 hover:ring-[#5B30A6] transition-all">
                  <AvatarImage src={user?.profilePhoto} alt={user?.fullName} />
                  <AvatarFallback className="bg-gray-100 text-gray-600">
                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 bg-white shadow-lg rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 ring-2 ring-gray-200">
                    <AvatarImage
                      src={user?.profilePhoto}
                      alt={user?.fullName}
                    />
                    <AvatarFallback className="bg-gray-100 text-gray-600">
                      {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {user?.fullName || "User"}
                    </h4>
                    <p className="text-sm text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-1 text-gray-600">
                  {user?.role === "student" && (
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md"
                    >
                      <User2 size={18} className="text-gray-500" />
                      <span>View Profile</span>
                    </Link>
                  )}
                  <div
                    onClick={logoutHandler}
                    className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                  >
                    <LogOut size={18} className="text-gray-500" />
                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
