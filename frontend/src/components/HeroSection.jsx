import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// UI Components
import { Button } from "@/components/ui/button";
import { ComboboxSearch } from "@/components/ui/combobox";
import { Badge } from "@/components/ui/badge";

// Icons
import {
  Search,
  MapPin,
  Briefcase,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Users,
  Building2,
  CheckCircle,
} from "lucide-react";

// Data
import { provinces } from "@/utils/constant";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { categories } = useSelector((store) => store.category);

  // Local State
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  // Text Rotation Logic
  const [current, setCurrent] = useState(0);
  const messages = [
    "Connect opportunities, build your future!",
    "Find the job that fits your life.",
    "Your dream career starts here.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.append("keyword", keyword.trim());
    if (category) params.append("category", category);
    if (location) params.append("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative w-full pt-20 pb-24 lg:pt-32 lg:pb-32 overflow-hidden bg-slate-50/50">
      {/* --- 1. BACKGROUND DECORATION (Hiệu ứng nền) --- */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white">
        {/* Lưới chấm nhỏ */}
        <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        {/* Đốm sáng tím (Blur Blob) */}
        <div className="absolute left-0 right-0 top-[-10%] m-auto h-[300px] w-[300px] rounded-full bg-purple-400/20 blur-[100px]"></div>
        <div className="absolute right-[-5%] bottom-[20%] h-[250px] w-[250px] rounded-full bg-blue-400/20 blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* 2. BADGE */}
        <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Badge
            variant="outline"
            className="px-4 py-1.5 rounded-full border-purple-200 bg-white text-[#6A38C2] text-sm font-medium shadow-sm flex items-center gap-2"
          >
            <Sparkles size={14} className="fill-purple-100" /> No. 1 Job Hunt
            Platform
          </Badge>
        </div>

        {/* 3. HEADLINES */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Search, Apply & <br className="hidden md:block" />
          Get Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-blue-600">
            Dream Job
          </span>
        </h1>

        {/* 4. ANIMATED SUBTEXT */}
        <div className="h-8 relative overflow-hidden mb-10">
          <div
            className="transition-transform duration-500 ease-in-out absolute w-full"
            style={{ transform: `translateY(-${current * 100}%)` }}
          >
            {messages.map((msg, i) => (
              <p
                key={i}
                className="text-lg md:text-xl text-slate-500 font-medium h-8 flex items-center justify-center"
              >
                {msg}
              </p>
            ))}
          </div>
        </div>

        {/* 5. SEARCH BOX (Unified Bar) */}
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <div className="bg-white p-2 rounded-2xl md:rounded-full shadow-xl shadow-purple-100/50 border border-slate-200/60 flex flex-col md:flex-row items-center gap-2 md:gap-0">
            {/* Keyword Input */}
            <div className="flex items-center px-4 w-full md:flex-1 h-12 md:h-auto border-b md:border-b-0 md:border-r border-slate-100">
              <Search className="text-slate-400 w-5 h-5 mr-3" />
              <input
                type="text"
                placeholder="Job title, keywords..."
                className="w-full outline-none text-slate-700 placeholder:text-slate-400 bg-transparent font-medium"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            {/* Category Select */}
            <div className="flex items-center px-4 w-full md:w-[240px] h-12 md:h-auto border-b md:border-b-0 md:border-r border-slate-100">
              <Briefcase className="text-slate-400 w-5 h-5 mr-3 shrink-0" />
              <div className="flex-1 min-w-0">
                <ComboboxSearch
                  value={category}
                  onChange={setCategory}
                  placeholder="Category"
                  items={categories.map((c) => ({
                    label: c.name,
                    value: c._id,
                  }))}
                  className="border-none shadow-none p-0 h-auto text-slate-700 font-medium bg-transparent focus:ring-0 w-full"
                />
              </div>
            </div>

            {/* Location Select */}
            <div className="flex items-center px-4 w-full md:w-[220px] h-12 md:h-auto">
              <MapPin className="text-slate-400 w-5 h-5 mr-3 shrink-0" />
              <div className="flex-1 min-w-0">
                <ComboboxSearch
                  value={location}
                  onChange={setLocation}
                  placeholder="Location"
                  items={provinces.map((p) => ({ label: p, value: p }))}
                  className="border-none shadow-none p-0 h-auto text-slate-700 font-medium bg-transparent focus:ring-0 w-full"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="w-full md:w-auto p-1">
              <Button
                onClick={handleSearch}
                size="lg"
                className="w-full md:w-auto rounded-xl md:rounded-full bg-[#6A38C2] hover:bg-[#5a2ea6] text-white px-8 h-12 font-bold text-base shadow-lg shadow-purple-200 transition-all hover:scale-105"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-slate-500">
            <span className="font-medium">Popular:</span>
            {["Frontend", "Backend", "Fullstack", "Designer", "Remote"].map(
              (tag) => (
                <span
                  key={tag}
                  onClick={() => {
                    setKeyword(tag);
                  }}
                  className="cursor-pointer hover:text-[#6A38C2] hover:underline transition-colors bg-white px-2 py-0.5 rounded-md border border-slate-100 shadow-sm"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>

        {/* 6. FOOTER ACTIONS / STATS */}
        <div className="mt-16 border-t border-slate-200 pt-10">
          {!user ? (
            <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <p className="text-slate-500 font-medium">
                Join thousands of professionals building their careers.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-slate-900 text-white hover:bg-slate-800 px-8 rounded-full h-11 font-semibold shadow-md"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/signup")}
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-white hover:border-purple-300 px-8 rounded-full h-11 font-semibold bg-white shadow-sm"
                >
                  Register
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <StatItem icon={Briefcase} count="10k+" label="Daily Jobs" />
              <StatItem icon={Building2} count="500+" label="Companies" />
              <StatItem icon={Users} count="1M+" label="Active Users" />
              <StatItem icon={TrendingUp} count="100%" label="Success Rate" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Helper Component
const StatItem = ({ icon: Icon, count, label }) => (
  <div className="flex flex-col items-center p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300">
    <div className="mb-3 p-2.5 bg-white rounded-full shadow-sm text-[#6A38C2] border border-purple-50">
      <Icon size={20} />
    </div>
    <span className="text-2xl font-bold text-slate-900">{count}</span>
    <span className="text-sm text-slate-500 font-medium">{label}</span>
  </div>
);

export default HeroSection;
