import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetAllCategories from "../hooks/useGetAllCategoris";

// Icons
import {
  Code,
  Megaphone,
  BarChart3,
  Briefcase,
  Palette,
  Wallet,
  Users,
  Search,
  X,
  LayoutGrid,
} from "lucide-react";

// UI Components (Giả sử bạn dùng Shadcn hoặc Tailwind thuần)
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const categoryIcons = {
  "IT Software Development": <Code className="w-8 h-8 text-[#6A38C2]" />,
  Marketing: <Megaphone className="w-8 h-8 text-[#E67E22]" />,
  "Business Analysis": <BarChart3 className="w-8 h-8 text-[#16A085]" />,
  Sales: <Briefcase className="w-8 h-8 text-[#C0392B]" />,
  Design: <Palette className="w-8 h-8 text-[#9B59B6]" />,
  Finance: <Wallet className="w-8 h-8 text-[#2C3E50]" />,
  "Human Resources": <Users className="w-8 h-8 text-[#2980B9]" />,
};

const ITEMS_PER_PAGE = 8;

const Browse = () => {
  const navigate = useNavigate();
  // Hook lấy data (giữ nguyên logic của bạn)
  const { loading, error } = useGetAllCategories();
  const { categories } = useSelector((store) => store.category);

  // Local State
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // 1. Logic Lọc Categories
  const filteredCategories = (categories || []).filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Logic Pagination trên danh sách ĐÃ LỌC
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const currentItems = filteredCategories.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // 3. Reset về trang 1 khi tìm kiếm
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handleClick = (id) => {
    navigate(`/jobs?category=${id}`);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-red-500 font-medium">Failed to load categories.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* --- HEADER & FILTER SECTION --- */}
      <div className="bg-white border-b border-gray-200 pt-24 pb-12 px-4 mb-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Explore Job <span className="text-[#6A38C2]">Categories</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover thousands of job opportunities by selecting a field that
            matches your skills and interests.
          </p>

          {/* SEARCH BAR */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Find a category (e.g. Marketing, Design)..."
              className="pl-10 pr-10 h-12 text-base rounded-full shadow-sm border-gray-300 focus:border-[#6A38C2] focus:ring-1 focus:ring-[#6A38C2]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Empty Search Result */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 p-4 rounded-full inline-flex mb-4">
              <LayoutGrid className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              No categories found
            </h3>
            <p className="text-gray-500 mt-2">
              We couldn't find any category matching "{searchTerm}".
            </p>
            <Button
              variant="link"
              onClick={clearSearch}
              className="text-[#6A38C2] mt-2"
            >
              Clear search
            </Button>
          </div>
        ) : (
          <>
            {/* Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentItems.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() => handleClick(cat._id)}
                  className="group relative bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer 
                        transition-all duration-300 ease-out
                        hover:-translate-y-1 hover:shadow-xl hover:border-[#6A38C2]/30"
                >
                  {/* Icon Box */}
                  <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center mb-5 group-hover:bg-[#6A38C2]/10 transition-colors">
                    {categoryIcons[cat.name] || (
                      <Briefcase className="w-7 h-7 text-gray-600" />
                    )}
                  </div>

                  {/* Text Content */}
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-[#6A38C2] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Explore open positions
                    </p>
                  </div>

                  {/* Arrow (Hidden initially, shows on hover) */}
                  <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <span className="text-[#6A38C2] font-semibold text-2xl">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* --- PAGINATION --- */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="h-9"
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (num) => (
                      <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${
                          num === page
                            ? "bg-[#6A38C2] text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {num}
                      </button>
                    )
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="h-9"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Browse;
