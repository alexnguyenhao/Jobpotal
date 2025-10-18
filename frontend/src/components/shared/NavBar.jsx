import React, { useState, useEffect } from "react";
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMenuOpen]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/profile`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUser(res.data.user));
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    if (!user && !loading) {
      checkUser();
    }
  }, [user, loading, dispatch]);

  const logoutHandler = async () => {
    setIsLoggingOut(true);
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message, { duration: 3000 });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed", {
        duration: 3000,
      });
    } finally {
      setIsLoggingOut(false);
      setIsMenuOpen(false);
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const homeRoute = user?.role === "recruiter" ? "/admin/companies" : "/";

  return (
    <nav className="bg-white shadow-md  w-full">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to={homeRoute} onClick={handleMenuClose}>
            <h1 className="text-2xl font-bold tracking-tight">
              Job
              <span className="text-[#F83002] hover:text-[#E82200] transition-colors">
                Portal
              </span>
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {loading ? (
          <div className="hidden md:flex items-center gap-12">
            <span className="text-gray-500">Loading...</span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6 font-medium text-gray-600">
              {user?.role === "recruiter" ? (
                <>
                  <li className="hover:text-[#F83002] transition-colors duration-200">
                    <Link to="/admin/companies" onClick={handleMenuClose}>
                      Companies
                    </Link>
                  </li>
                  <li className="hover:text-[#F83002] transition-colors duration-200">
                    <Link to="/admin/jobs" onClick={handleMenuClose}>
                      Jobs
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="hover:text-[#F83002] transition-colors duration-200">
                    <Link to="/" onClick={handleMenuClose}>
                      Home
                    </Link>
                  </li>
                  <li className="hover:text-[#F83002] transition-colors duration-200">
                    <Link to="/jobs" onClick={handleMenuClose}>
                      Jobs
                    </Link>
                  </li>
                  <li className="hover:text-[#F83002] transition-colors duration-200">
                    <Link to="/browse" onClick={handleMenuClose}>
                      Browse
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {/* User Actions */}
            {!user ? (
              <div className="flex items-center gap-3">
                <Link to="/login" onClick={handleMenuClose}>
                  <Button
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={handleMenuClose}>
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
                      {user?.fullName?.charAt(0) || "AN"}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4 bg-white shadow-lg rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar className="cursor-pointer w-10 h-10 ring-2 ring-gray-200 hover:ring-[#F83002] transition-all">
                      <AvatarImage
                        src={
                          user?.profile?.profilePhoto || "/default-avatar.png"
                        }
                        alt={user?.fullName || "User"}
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
                        {user?.role || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1 text-gray-600">
                    {user?.role === "student" && (
                      <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer transition-colors">
                        <User2 size={18} className="text-gray-500" />
                        <Button variant="link" className="p-0 text-gray-700">
                          <Link to="/profile" onClick={handleMenuClose}>
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer transition-colors">
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
        )}

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            onClick={handleMenuToggle}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
            onClick={handleMenuClose}
          />
          <div className="fixed top-0 left-0 w-full h-full bg-white z-50 md:hidden overflow-y-auto transition-all animate-slide-down">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <Link to={homeRoute} onClick={handleMenuClose}>
                <h1 className="text-2xl font-bold tracking-tight">
                  Job<span className="text-[#F83002]">Portal</span>
                </h1>
              </Link>
              <Button
                variant="ghost"
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                onClick={handleMenuClose}
                aria-label="Close menu"
              >
                <X size={24} />
              </Button>
            </div>
            <div className="px-4 py-4">
              {loading ? (
                <div className="text-center py-4 text-gray-500">Loading...</div>
              ) : (
                <>
                  <ul className="space-y-3 font-medium text-gray-600">
                    {user?.role === "recruiter" ? (
                      <>
                        <li className="hover:text-[#F83002] transition-colors">
                          <Link to="/admin/companies" onClick={handleMenuClose}>
                            Companies
                          </Link>
                        </li>
                        <li className="hover:text-[#F83002] transition-colors">
                          <Link to="/admin/jobs" onClick={handleMenuClose}>
                            Jobs
                          </Link>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="hover:text-[#F83002] transition-colors">
                          <Link to="/" onClick={handleMenuClose}>
                            Home
                          </Link>
                        </li>
                        <li className="hover:text-[#F83002] transition-colors">
                          <Link to="/jobs" onClick={handleMenuClose}>
                            Jobs
                          </Link>
                        </li>
                        <li className="hover:text-[#F83002] transition-colors">
                          <Link to="/browse" onClick={handleMenuClose}>
                            Browse
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                  <div className="mt-6 flex flex-col gap-3">
                    {!user ? (
                      <>
                        <Link to="/login" onClick={handleMenuClose}>
                          <Button
                            variant="outline"
                            className="w-full border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold"
                          >
                            Login
                          </Button>
                        </Link>
                        <Link to="/signup" onClick={handleMenuClose}>
                          <Button className="w-full bg-[#6A38C2] hover:bg-[#5B30A6] text-white font-semibold">
                            Signup
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 border-b pb-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={user?.profile?.profilePhoto}
                              alt={user?.fullName}
                            />
                            <AvatarFallback className="bg-gray-100 text-gray-600">
                              {user?.fullName?.charAt(0) || "AN"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {user?.fullName || "User"}
                            </h4>
                            <p className="text-sm text-gray-500 capitalize">
                              {user?.role || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col text-gray-600">
                          {user?.role === "student" && (
                            <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                              <User2 size={18} className="text-gray-500" />
                              <Button
                                variant="link"
                                className="p-0 text-gray-700"
                              >
                                <Link to="/profile" onClick={handleMenuClose}>
                                  View Profile
                                </Link>
                              </Button>
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
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavBar;
