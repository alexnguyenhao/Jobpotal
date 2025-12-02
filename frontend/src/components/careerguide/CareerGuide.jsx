import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // IMPORT THÊM
import useCareerGuide from "@/hooks/useCareerGuide";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, BookOpen, Sparkles } from "lucide-react";
import GuideCard from "@/components/careerguide/GuideCard";
import { categories } from "@/utils/constant";

const CareerGuide = () => {
  const { publicGuides, loading, fetchPublicGuides } = useCareerGuide();
  const [searchParams] = useSearchParams(); // Hook để lấy params từ URL

  // Khởi tạo state từ URL (nếu có)
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );

  // 1. Lắng nghe sự thay đổi của URL (ví dụ: khi bấm Back hoặc bấm Tag từ trang khác tới)
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword") || "";
    const urlCategory = searchParams.get("category") || "all";

    if (urlKeyword !== keyword) setKeyword(urlKeyword);
    if (urlCategory !== category) setCategory(urlCategory);
  }, [searchParams]);

  // 2. Fetch API khi keyword hoặc category thay đổi (Debounce search)
  useEffect(() => {
    const params = {
      keyword: keyword.trim(),
      ...(category !== "all" && { category }),
    };

    const timer = setTimeout(() => {
      fetchPublicGuides(params);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, category]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* --- HERO SECTION --- */}
      <div className="bg-white border-b border-gray-100 py-16 md:py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <span className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-purple-50 text-[#6A38C2] font-semibold text-xs tracking-wide uppercase">
            <Sparkles size={14} className="mr-2" /> Career Advice & Tips
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Shape Your{" "}
            <span className="text-[#6A38C2] underline decoration-wavy underline-offset-8">
              Future Career
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Discover expert advice, interview strategies, and industry insights
            to help you land your dream job.
          </p>

          {/* --- SEARCH BAR --- */}
          <div className="max-w-3xl mx-auto bg-white p-2 rounded-full shadow-xl border border-gray-100 flex flex-col md:flex-row items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics (e.g. Resume, Interview...)"
                className="w-full h-12 pl-12 pr-4 text-gray-700 bg-transparent outline-none placeholder:text-gray-400"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            {/* Divider (Desktop only) */}
            <div className="hidden md:block w-[1px] h-8 bg-gray-200"></div>

            {/* Category Select */}
            <div className="w-full md:w-[220px]">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 border-none shadow-none focus:ring-0 bg-transparent text-gray-600 font-medium rounded-full px-4">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div className="w-full md:w-auto">
              <button className="w-full md:w-12 h-12 bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-full flex items-center justify-center transition-all shadow-md">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="text-[#6A38C2]" />
          <h2 className="text-2xl font-bold text-gray-900">
            {keyword ? `Results for "${keyword}"` : "Latest Articles"}
          </h2>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="space-y-3">
                <Skeleton className="h-52 w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Empty State */}
            {publicGuides.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400 h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  No articles found
                </h3>
                <p className="text-gray-500 mt-1">
                  Try adjusting your search terms or category filter.
                </p>
                <button
                  onClick={() => {
                    setKeyword("");
                    setCategory("all");
                  }}
                  className="mt-4 text-[#6A38C2] font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              // Grid List
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {publicGuides.map((guide) => (
                  <GuideCard key={guide._id} guide={guide} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CareerGuide;
