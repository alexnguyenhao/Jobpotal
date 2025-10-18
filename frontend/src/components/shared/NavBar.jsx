import React, { useState, useEffect, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { LogOut, User2, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant.js";
import { setUser } from "@/redux/authSlice.js";
import { toast } from "sonner";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  // ✅ 1. Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMenuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMenuOpen]);

  // ✅ 2. Fetch user profile only once
  useEffect(() => {
    if (hasFetched.current || user || loading) return;
    hasFetched.current = true;

    const checkUser = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/profile`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUser(res.data.user));
        }
      } catch (error) {
        console.warn("No active session:", error?.response?.status);
      }
    };

    checkUser();
  }, [user, loading, dispatch]);

  // ✅ 3. Logout
  const logoutHandler = async () => {
    setIsLoggingOut(true);
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success("You have logged out successfully");
      }
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
            <span className="text-[#F83002] hover:text-[#E82200] transition-colors">
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
                      className="hover:text-[#F83002] transition-colors"
                    >
                      Companies
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/jobs"
                      className="hover:text-[#F83002] transition-colors"
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
                      className="hover:text-[#F83002] transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/jobs"
                      className="hover:text-[#F83002] transition-colors"
                    >
                      Jobs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/browse"
                      className="hover:text-[#F83002] transition-colors"
                    >
                      Browse
                    </Link>
                  </li>
                </>
              )}
            </ul>
          )}

          {/* User Actions */}
          {!user ? (
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
                <Avatar className="cursor-pointer w-10 h-10 ring-2 ring-gray-200 hover:ring-[#F83002] transition-all">
                  <AvatarImage
                    src={user?.profile?.profilePhoto}
                    alt={user?.fullName}
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-600">
                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 bg-white shadow-lg rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 ring-2 ring-gray-200">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
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
                    <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                      <User2 size={18} className="text-gray-500" />
                      <Link to="/profile">
                        <Button variant="link" className="p-0 text-gray-700">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  )}
                  <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <LogOut size={18} className="text-gray-500" />
                    <Button
                      onClick={logoutHandler}
                      variant="link"
                      className="p-0 text-gray-700"
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </Button>
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

      {/* ✅ Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white animate-slide-down overflow-y-auto md:hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h1 className="text-2xl font-bold">
              Job<span className="text-[#F83002]">Portal</span>
            </h1>
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-full"
            >
              <X size={24} />
            </Button>
          </div>

          <div className="p-4 space-y-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 border-b pb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt={user?.fullName}
                    />
                    <AvatarFallback>
                      {user?.fullName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {user.fullName}
                    </h4>
                    <p className="text-sm text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>

                {user.role === "student" && (
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-gray-700"
                    >
                      View Profile
                    </Button>
                  </Link>
                )}

                <Button
                  onClick={logoutHandler}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-gray-100 text-gray-700"
                  >
                    Signup
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
