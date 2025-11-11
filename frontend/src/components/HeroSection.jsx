import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ComboboxSearch } from "@/components/ui/combobox";
import { Search, LogIn, UserPlus } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { provinces } from "@/utils/constant";
import { useDispatch } from "react-redux";

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { categories } = useSelector((store) => store.category);

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

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword.trim()) params.append("keyword", keyword.trim());
    if (category) params.append("category", category);
    if (location) params.append("location", location);

    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
      <span className="px-4 py-2 mb-4 rounded-full bg-purple-50 text-[#6A38C2] font-semibold text-sm tracking-wide shadow-sm">
        🚀 No. 1 Job Hunt Platform
      </span>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
        Search, Apply & <br />
        Get Your{" "}
        <span className="text-[#6A38C2] underline decoration-wavy underline-offset-4">
          Dream Job
        </span>
      </h1>

      <div className="relative overflow-hidden h-8 mt-4 text-gray-600 text-lg font-medium">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {messages.map((msg, i) => (
            <p key={i} className="min-w-full">
              {msg}
            </p>
          ))}
        </div>
      </div>

      {/* AUTH CHECK */}
      {user ? (
        <div className="w-full max-w-3xl mt-10 bg-white shadow-lg border border-gray-200 rounded-full p-2 flex gap-2 items-center">
          {/* Keyword */}
          <input
            type="text"
            placeholder="Search job..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="h-12 flex-1 px-5 outline-none bg-transparent rounded-full"
          />

          {/* CATEGORY */}
          <div className="w-[180px]">
            <ComboboxSearch
              value={category}
              onChange={setCategory}
              placeholder="Category"
              items={categories.map((c) => ({
                label: c.name,
                value: c._id,
              }))}
            />
          </div>

          {/* LOCATION */}
          <div className="w-[160px]">
            <ComboboxSearch
              value={location}
              onChange={setLocation}
              placeholder="Location"
              items={provinces.map((p) => ({
                label: p,
                value: p,
              }))}
            />
          </div>

          {/* Search btn */}
          <Button
            onClick={handleSearch}
            className="h-12 rounded-full bg-[#6A38C2] hover:bg-[#5930a5] px-6 flex items-center gap-2"
          >
            <Search className="h-5 w-5" />
            Search
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4 mt-8">
          <Button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 bg-[#6A38C2] hover:bg-[#5930a5]"
          >
            <LogIn className="w-4 h-4" /> Login
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/signup")}
            className="flex items-center gap-2 border-[#6A38C2] text-[#6A38C2] hover:bg-purple-50"
          >
            <UserPlus className="w-4 h-4" /> Register
          </Button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
