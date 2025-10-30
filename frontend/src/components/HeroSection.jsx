import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, LogIn, UserPlus } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth); // ✅ lấy user từ redux (hoặc context)

  const messages = [
    "Connect opportunities, build your future!",
    "Solid Career – Bright Future",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
      {/* Tagline */}
      <span className="px-4 py-2 mb-4 rounded-full bg-purple-50 text-[#6A38C2] font-semibold text-sm tracking-wide shadow-sm">
        🚀 No. 1 Job Hunt Platform
      </span>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
        Search, Apply & <br />
        Get Your{" "}
        <span className="text-[#6A38C2] underline decoration-wavy underline-offset-4">
          Dream Job
        </span>
      </h1>

      {/* Animated tagline */}
      <div className="relative overflow-hidden h-8 mt-4 text-gray-600 text-lg font-medium">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {messages.map((message, index) => (
            <p key={index} className="min-w-full">
              {message}
            </p>
          ))}
        </div>
      </div>

      {/* ✅ Conditional content */}
      {user ? (
        // ==== WHEN LOGGED IN ====
        <div className="flex items-center w-full max-w-xl mt-8 bg-white border border-gray-200 shadow-md rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-[#6A38C2] transition-all duration-300">
          <input
            type="text"
            placeholder="🔍  Find your dream job..."
            className="flex-1 px-5 h-12 text-base outline-none bg-transparent placeholder:text-gray-400"
          />
          <Button
            type="button"
            className="h-12 rounded-none rounded-r-full bg-[#6A38C2] hover:bg-[#5930a5] px-6 flex items-center justify-center gap-2"
          >
            <Search className="h-5 w-5" />
            <span className="hidden sm:inline font-medium">Search</span>
          </Button>
        </div>
      ) : (
        // ==== WHEN NOT LOGGED IN ====
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <Button
            onClick={() => navigate("/login")}
            className="bg-[#6A38C2] hover:bg-[#5930a5] px-8 py-3 rounded-full flex items-center gap-2"
          >
            <LogIn className="h-5 w-5" />
            Login to Start
          </Button>
          <Button
            onClick={() => navigate("/signup")}
            variant="outline"
            className="border-[#6A38C2] text-[#6A38C2] hover:bg-[#f5f0ff] px-8 py-3 rounded-full flex items-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            Create Account
          </Button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
