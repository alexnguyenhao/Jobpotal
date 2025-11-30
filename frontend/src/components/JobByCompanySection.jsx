import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getJobByCompany } from "@/hooks/useGetJobs"; // Đảm bảo hook này gọi đúng API
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  DollarSign,
  Building2,
  ArrowRight,
  Briefcase,
} from "lucide-react";

const ITEMS_PER_GROUP = 3;

const JobByCompanySection = () => {
  const navigate = useNavigate();
  // Lấy danh sách công ty từ Redux (đã được fetch ở trang Home)
  const { companies } = useSelector((store) => store.company);

  const [jobsByCompany, setJobsByCompany] = useState({});
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loadingJobs, setLoadingJobs] = useState(false); // Trạng thái loading cục bộ

  // 1. Gom nhóm công ty (Chunking array)
  const groupedCompanies = [];
  if (companies && companies.length > 0) {
    for (let i = 0; i < companies.length; i += ITEMS_PER_GROUP) {
      groupedCompanies.push(companies.slice(i, i + ITEMS_PER_GROUP));
    }
  }

  // 2. Fetch Jobs khi chuyển slide (Lazy loading jobs)
  useEffect(() => {
    const fetchJobsForCurrentSlide = async () => {
      const currentGroup = groupedCompanies[index];
      if (!currentGroup) return;

      // Lọc ra những công ty chưa có data jobs trong cache (jobsByCompany)
      const companiesNeedFetch = currentGroup.filter(
        (com) => !jobsByCompany[com._id]
      );

      if (companiesNeedFetch.length > 0) {
        setLoadingJobs(true);

        // Fetch song song cho các công ty cần thiết
        const results = await Promise.all(
          companiesNeedFetch.map(async (com) => {
            try {
              const jobs = await getJobByCompany(com._id);
              return {
                companyId: com._id,
                jobs: Array.isArray(jobs) ? jobs.slice(0, 3) : [],
              };
            } catch (error) {
              console.error(`Error fetching jobs for ${com.name}:`, error);
              return { companyId: com._id, jobs: [] };
            }
          })
        );

        // Cập nhật state 1 lần duy nhất để tránh re-render nhiều lần
        setJobsByCompany((prev) => {
          const newData = { ...prev };
          results.forEach((item) => {
            newData[item.companyId] = item.jobs;
          });
          return newData;
        });

        setLoadingJobs(false);
      }
    };

    if (groupedCompanies.length > 0) {
      fetchJobsForCurrentSlide();
    }
  }, [index, companies]); // Dependency: index thay đổi hoặc danh sách công ty thay đổi

  // Nếu chưa có công ty nào thì không hiển thị section này
  if (!groupedCompanies.length) return null;

  // --- HANDLERS ---
  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % groupedCompanies.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? groupedCompanies.length - 1 : prev - 1));
  };

  // --- ANIMATION ---
  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
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
    <section className="py-20 bg-white relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              Top Hiring <span className="text-[#6A38C2]">Companies</span>
            </h2>
            <p className="text-gray-500 text-lg">
              Discover opportunities from industry leaders.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handlePrev}
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 border-gray-300 hover:border-[#6A38C2] hover:text-[#6A38C2]"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              onClick={handleNext}
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 border-gray-300 hover:border-[#6A38C2] hover:text-[#6A38C2]"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        {/* SLIDER CONTENT */}
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
              {groupedCompanies[index].map((com) => {
                // Lấy danh sách job của công ty này từ state cache
                const companyJobs = jobsByCompany[com._id];
                // Kiểm tra xem có đang loading data cho công ty này không
                const isFetching = loadingJobs && companyJobs === undefined;

                return (
                  <div
                    key={com._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                  >
                    {/* Company Header */}
                    <div className="p-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 flex items-center gap-4">
                      <Avatar className="h-14 w-14 rounded-xl border bg-white shadow-sm">
                        <AvatarImage src={com.logo} className="object-cover" />
                        <AvatarFallback className="rounded-xl bg-gray-100">
                          <Building2 className="text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-bold text-lg text-gray-900 truncate cursor-pointer hover:text-[#6A38C2] transition-colors"
                          onClick={() => navigate(`/company/${com._id}`)}
                        >
                          {com.name}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin size={12} className="mr-1" />
                          <span className="truncate">
                            {com.location || "Headquarters"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Job List */}
                    <div className="p-4 space-y-2 flex-1 bg-white">
                      {isFetching ? (
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
                      ) : companyJobs && companyJobs.length > 0 ? (
                        // Job Items
                        companyJobs.map((job) => (
                          <div
                            key={job._id}
                            onClick={() => navigate(`/description/${job._id}`)}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-50 cursor-pointer transition-colors group/item border border-transparent hover:border-purple-100"
                          >
                            <div className="min-w-0">
                              <h4 className="font-semibold text-sm text-gray-800 truncate group-hover/item:text-[#6A38C2]">
                                {job.title}
                              </h4>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <MapPin size={10} />{" "}
                                  {job.location?.province || "Remote"}
                                </span>
                                <span className="flex items-center gap-1 text-green-600 font-medium">
                                  <DollarSign size={10} />{" "}
                                  {formatSalary(job.salary)}
                                </span>
                              </div>
                            </div>
                            <ArrowRight
                              size={16}
                              className="text-gray-300 group-hover/item:text-[#6A38C2] transition-colors opacity-0 group-hover/item:opacity-100 transform translate-x-[-5px] group-hover/item:translate-x-0 duration-300"
                            />
                          </div>
                        ))
                      ) : (
                        // Empty State
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-6 opacity-60">
                          <Briefcase size={28} className="mb-2" />
                          <p className="text-sm">No open positions</p>
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="p-4 border-t border-gray-50 bg-gray-50/50">
                      <Button
                        variant="ghost"
                        className="w-full text-sm font-medium text-[#6A38C2] hover:text-[#5a2ea6] hover:bg-purple-50 h-9"
                        onClick={() => navigate(`/company/${com._id}`)}
                      >
                        View Company Profile
                      </Button>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {groupedCompanies.map((_, i) => (
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

// Helper Format Salary
const formatSalary = (salary) => {
  if (!salary || salary.isNegotiable) return "Negotiable";
  const { min, max, currency } = salary;

  // Format số tiền gọn (VD: 10M, 500K)
  const formatNum = (n) => {
    if (n >= 1000000) return `${(n / 1000000).toString()}M`;
    if (n >= 1000) return `${(n / 1000).toString()}K`;
    return n.toString();
  };

  const currencySymbol = currency === "USD" ? "$" : ""; // Thêm ký hiệu tiền tệ nếu cần

  if (min && max) return `${currencySymbol}${formatNum(min)}-${formatNum(max)}`;
  return "Negotiable";
};

export default JobByCompanySection;
