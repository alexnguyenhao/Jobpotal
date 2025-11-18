import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getJobByCategory } from "@/hooks/useGetJobs";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Building2,
  ArrowRight,
} from "lucide-react";

const ITEMS_PER_GROUP = 3;

const JobByCategorySection = () => {
  const navigate = useNavigate();
  const { categories } = useSelector((store) => store.category);

  const [jobsByCategory, setJobsByCategory] = useState({});
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // 1. Gom nhóm danh mục
  const groupedCategories = [];
  if (categories) {
    for (let i = 0; i < categories.length; i += ITEMS_PER_GROUP) {
      groupedCategories.push(categories.slice(i, i + ITEMS_PER_GROUP));
    }
  }

  // 2. Fetch Jobs khi chuyển slide
  useEffect(() => {
    const fetchJobs = async () => {
      const currentGroup = groupedCategories[index];
      if (!currentGroup) return;

      // Kiểm tra xem đã có data trong cache chưa
      const missingData = currentGroup.some((cat) => !jobsByCategory[cat._id]);

      if (missingData) {
        setLoadingJobs(true);
        const newJobsMap = { ...jobsByCategory };

        await Promise.all(
          currentGroup.map(async (cat) => {
            if (!newJobsMap[cat._id]) {
              const res = await getJobByCategory(cat._id);
              // Lấy tối đa 3 job để hiển thị đẹp
              newJobsMap[cat._id] = res ? res.slice(0, 3) : [];
            }
          })
        );

        setJobsByCategory(newJobsMap);
        setLoadingJobs(false);
      }
    };

    if (groupedCategories.length > 0) {
      fetchJobs();
    }
  }, [index, groupedCategories]);

  if (!groupedCategories.length) return null;

  // --- HANDLERS ---
  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % groupedCategories.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? groupedCategories.length - 1 : prev - 1));
  };

  // --- ANIMATION VARIANTS ---
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: (direction) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    }),
  };

  return (
    <section className="py-20 bg-gray-50/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              Explore Top <span className="text-[#6A38C2]">Categories</span>
            </h2>
            <p className="text-gray-500 text-lg">
              Find the best opportunities in trending sectors.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handlePrev}
              variant="outline"
              size="icon"
              className="rounded-full border-gray-300 hover:border-[#6A38C2] hover:text-[#6A38C2] h-10 w-10 bg-white"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              onClick={handleNext}
              variant="outline"
              size="icon"
              className="rounded-full border-gray-300 hover:border-[#6A38C2] hover:text-[#6A38C2] h-10 w-10 bg-white"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        {/* SLIDER */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {groupedCategories[index].map((cat) => (
                <div
                  key={cat._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 text-[#6A38C2] flex items-center justify-center">
                        <Briefcase size={20} />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {cat.name}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-[#6A38C2] hover:bg-purple-50 rounded-full px-3"
                      onClick={() => navigate(`/jobs?category=${cat._id}`)}
                    >
                      View all <ArrowRight size={12} className="ml-1" />
                    </Button>
                  </div>

                  {/* Job List */}
                  <div className="p-4 space-y-3 flex-1 bg-white">
                    {loadingJobs && !jobsByCategory[cat._id] ? (
                      // Skeleton Loading
                      [1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 p-2">
                          <Skeleton className="w-10 h-10 rounded-md" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))
                    ) : // Real Data
                    jobsByCategory[cat._id]?.length > 0 ? (
                      jobsByCategory[cat._id].map((job) => (
                        <div
                          key={job._id}
                          onClick={() => navigate(`/description/${job._id}`)}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group/item"
                        >
                          <Avatar className="h-10 w-10 rounded-lg border bg-white mt-1">
                            <AvatarImage
                              src={job.company?.logo}
                              objectFit="contain"
                            />
                            <AvatarFallback className="rounded-lg bg-gray-100">
                              <Building2 size={16} className="text-gray-400" />
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 truncate group-hover/item:text-[#6A38C2] transition-colors">
                              {job.title}
                            </h4>
                            <p className="text-xs text-gray-500 truncate mb-1">
                              {job.company?.name}
                            </p>

                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 h-5 bg-gray-100 text-gray-600 border-0 font-normal"
                              >
                                <MapPin size={10} className="mr-1" />{" "}
                                {job.location?.province || "Remote"}
                              </Badge>
                              <span className="text-[10px] text-green-600 font-medium">
                                {formatSalary(job.salary)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 py-8">
                        <Briefcase size={32} className="mb-2 opacity-20" />
                        <p className="text-sm">No open positions yet</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {groupedCategories.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-8 bg-[#6A38C2]"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Helper format lương gọn
const formatSalary = (salary) => {
  if (!salary || salary.isNegotiable) return "Negotiable";
  const { min, max, currency } = salary;
  const fmt = (n) => (n >= 1000000 ? `${n / 1000000}M` : `${n / 1000}K`);
  if (min && max) return `${fmt(min)}-${fmt(max)} ${currency || ""}`;
  if (min) return `>${fmt(min)} ${currency || ""}`;
  return "Negotiable";
};

export default JobByCategorySection;
