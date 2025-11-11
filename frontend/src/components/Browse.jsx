import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetAllCategories from "../hooks/useGetAllCategoris";
import {
  Code,
  Megaphone,
  BarChart3,
  Briefcase,
  Palette,
  Wallet,
  Users,
} from "lucide-react";

const categoryIcons = {
  "IT Software Development": <Code className="w-7 h-7 text-[#6A38C2]" />,
  Marketing: <Megaphone className="w-7 h-7 text-[#E67E22]" />,
  "Business Analysis": <BarChart3 className="w-7 h-7 text-[#16A085]" />,
  Sales: <Briefcase className="w-7 h-7 text-[#C0392B]" />,
  Design: <Palette className="w-7 h-7 text-[#9B59B6]" />,
  Finance: <Wallet className="w-7 h-7 text-[#2C3E50]" />,
  "Human Resources": <Users className="w-7 h-7 text-[#2980B9]" />,
};

const ITEMS_PER_PAGE = 8;

const Browse = () => {
  const navigate = useNavigate();
  const { loading, error } = useGetAllCategories();
  const { categories } = useSelector((store) => store.category);

  const list = categories || [];

  // Pagination state
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);

  const currentItems = list.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleClick = (id) => {
    navigate(`/jobs?category=${id}`);
  };

  if (loading)
    return (
      <div className="text-center text-gray-500 py-20">
        Loading categories...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 py-20">
        Failed to load categories
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-3">Explore Job Categories</h1>
      <p className="text-gray-600 mb-8">
        Discover opportunities by selecting a field you're interested in.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentItems.map((cat) => (
          <div
            key={cat._id}
            onClick={() => handleClick(cat._id)}
            className="group cursor-pointer bg-white border border-gray-200 
              rounded-xl p-6 shadow-sm transition-all duration-300 
              hover:shadow-md hover:-translate-y-1"
          >
            <div className="mb-4">
              {categoryIcons[cat.name] || (
                <Briefcase className="w-7 h-7 text-gray-500" />
              )}
            </div>

            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-[#6A38C2] transition-colors">
              {cat.name}
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              View opportunities in {cat.name}
            </p>

            <button className="mt-4 text-[#6A38C2] font-medium text-sm group-hover:underline">
              View Jobs →
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          {/* Prev */}
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded-md border text-sm ${
              page === 1
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`w-9 h-9 rounded-md text-sm border ${
                num === page
                  ? "bg-[#6A38C2] text-white border-[#6A38C2]"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {num}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded-md border text-sm ${
              page === totalPages
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Browse;
