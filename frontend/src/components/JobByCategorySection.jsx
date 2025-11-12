import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getJobByCategory } from "@/hooks/useGetJobs";
import { useNavigate } from "react-router-dom";
import { MapPin, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const JobByCategorySection = () => {
  const navigate = useNavigate();
  const { categories } = useSelector((store) => store.category);

  const [jobsByCategory, setJobsByCategory] = useState({});
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 👈 lưu hướng trượt
  const [isManual, setIsManual] = useState(false);

  const ITEMS_PER_GROUP = 3;
  const INTERVAL = 10000;

  // Gom nhóm danh mục theo 3 item / nhóm
  const groupedCategories = [];
  for (let i = 0; i < categories.length; i += ITEMS_PER_GROUP) {
    groupedCategories.push(categories.slice(i, i + ITEMS_PER_GROUP));
  }

  // Auto slide
  useEffect(() => {
    if (groupedCategories.length === 0 || isManual) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % groupedCategories.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [groupedCategories.length, isManual]);

  // Fetch jobs cho nhóm hiện tại (có cache)
  useEffect(() => {
    const fetchJobs = async () => {
      const currentGroup = groupedCategories[index];
      if (!currentGroup) return;

      // Nếu đã có data cache, bỏ qua
      const hasCache = currentGroup.every((cat) => jobsByCategory[cat._id]);
      if (hasCache) return;

      const result = { ...jobsByCategory };
      for (const cat of currentGroup) {
        if (!result[cat._id]) {
          const jobs = await getJobByCategory(cat._id);
          result[cat._id] = jobs.slice(0, 3);
        }
      }
      setJobsByCategory(result);
    };

    if (groupedCategories.length) fetchJobs();
  }, [index, groupedCategories]);

  if (!groupedCategories.length) return null;

  // Điều hướng nhóm
  const handleNext = () => {
    setIsManual(true);
    setDirection(1);
    setIndex((prev) => (prev + 1) % groupedCategories.length);
  };

  const handlePrev = () => {
    setIsManual(true);
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? groupedCategories.length - 1 : prev - 1));
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({
      x: direction > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  return (
    <section className="relative my-16 w-full max-w-7xl mx-auto px-4 overflow-hidden">
      <h2 className="text-2xl font-bold mb-8 text-center">
        Jobs by <span className="text-[#6A38C2]">Category</span>
      </h2>

      {/* Nút điều hướng 2 bên */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 
        bg-white border border-gray-300 rounded-full p-3 shadow-md 
        hover:bg-gray-100 hover:scale-105 transition"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 
        bg-white border border-gray-300 rounded-full p-3 shadow-md 
        hover:bg-gray-100 hover:scale-105 transition"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Slide animation */}
      <div className="relative h-auto">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 200, damping: 25 },
              opacity: { duration: 0.2 },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {groupedCategories[index].map((cat) => (
              <div
                key={cat._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
              >
                <div className="py-3 px-4 bg-gray-100 text-center font-semibold text-lg text-gray-800">
                  {cat.name}
                </div>

                <div className="p-4 space-y-3">
                  {jobsByCategory[cat._id]?.length ? (
                    jobsByCategory[cat._id].map((job) => (
                      <div
                        key={job._id}
                        onClick={() => navigate(`/description/${job._id}`)}
                        className="flex gap-3 p-3 border border-gray-200 rounded-lg hover:shadow-md hover:border-[#6A38C2] transition cursor-pointer"
                      >
                        <img
                          src={
                            job.company?.logo ||
                            "https://via.placeholder.com/50"
                          }
                          alt="logo"
                          className="w-12 h-12 object-contain rounded-md border bg-white"
                        />

                        <div className="flex-1">
                          <p className="font-semibold text-[15px] text-gray-800 line-clamp-1">
                            {job.title}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {job.company?.name}
                          </p>
                          <div className="flex items-center text-[13px] text-red-500">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {job.salary?.min
                              ? `${job.salary.min} – ${job.salary.max} ${
                                  job.salary.currency || "VND"
                                }`
                              : "Negotiable"}
                          </div>
                          <div className="flex items-center text-[13px] text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location?.province || "N/A"}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No jobs available.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Chỉ báo nhóm */}
      <div className="flex justify-center gap-2 mt-6">
        {groupedCategories.map((_, i) => (
          <span
            key={i}
            onClick={() => {
              setIndex(i);
              setIsManual(true);
            }}
            className={`h-2 w-2 rounded-full cursor-pointer transition ${
              i === index ? "bg-[#6A38C2]" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default JobByCategorySection;
