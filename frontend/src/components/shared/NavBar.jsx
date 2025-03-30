import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { LogOut, User2, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = false; // Đặt thành true để kiểm tra trường hợp đăng nhập

    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link to="/" onClick={handleMenuClose}>
                        <h1 className="text-2xl font-bold">
                            Job<span className="text-[#F83002]">Portal</span>
                        </h1>
                    </Link>
                </div>

                {/* Navigation Links - Ẩn trên mobile */}
                <div className="hidden md:flex items-center gap-10">
                    <ul className="flex items-center gap-6 font-medium text-gray-700">
                        <li className="hover:text-[#F83002] transition-colors cursor-pointer">Home</li>
                        <li className="hover:text-[#F83002] transition-colors cursor-pointer">Jobs</li>
                        <li className="hover:text-[#F83002] transition-colors cursor-pointer">Browse</li>
                    </ul>

                    {/* User Actions */}
                    {!user ? (
                        <div className="flex items-center gap-3">
                            <Link to="/login">
                                <Button variant="outline" className="border-gray-300 hover:bg-gray-100">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-[#6A38C2] hover:bg-[#5B30A6] text-white">
                                    Signup
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer w-10 h-10">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>AN</AvatarFallback>
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                        <AvatarFallback>AN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Alex Nguyen</h4>
                                        <p className="text-sm text-gray-500">This is my profile</p>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2 text-gray-600">
                                    <div className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-md cursor-pointer">
                                        <User2 size={18} />
                                        <Button variant="link" className="p-0 text-gray-700">
                                            View Profile
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-md cursor-pointer">
                                        <LogOut size={18} />
                                        <Button variant="link" className="p-0 text-gray-700">
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <Button variant="ghost" className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu - Hiển thị khi click vào Menu Button */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 absolute w-full left-0 top-full shadow-md">
                    <ul className="space-y-4 font-medium text-gray-700">
                        <li className="hover:text-[#F83002] cursor-pointer" onClick={handleMenuClose}>
                            Home
                        </li>
                        <li className="hover:text-[#F83002] cursor-pointer" onClick={handleMenuClose}>
                            Jobs
                        </li>
                        <li className="hover:text-[#F83002] cursor-pointer" onClick={handleMenuClose}>
                            Browse
                        </li>
                    </ul>
                    <div className="mt-4 flex flex-col gap-3">
                        {!user ? (
                            <>
                                <Link to="/login" onClick={handleMenuClose}>
                                    <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup" onClick={handleMenuClose}>
                                    <Button className="w-full bg-[#6A38C2] hover:bg-[#5B30A6] text-white">
                                        Signup
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 border-b pb-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                        <AvatarFallback>AN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Alex Nguyen</h4>
                                        <p className="text-sm text-gray-500">This is my profile</p>
                                    </div>
                                </div>
                                <div className="flex flex-col text-gray-600">
                                    <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer" onClick={handleMenuClose}>
                                        <User2 size={18} />
                                        <span>View Profile</span>
                                    </div>
                                    <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer" onClick={handleMenuClose}>
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBar;