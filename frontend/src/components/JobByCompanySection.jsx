import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getJobByCompany } from "@/hooks/useGetJobs";
import { useNavigate } from "react-router-dom";
import { MapPin, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const JobByCompanySection = () => {
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  const [jobsByCompany, setJobsByCompany] = useState({});
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isManual, setIsManual] = useState(false);

  const ITEMS_PER_GROUP = 3;
  const INTERVAL = 10000;

  // Gom nhóm công ty theo 3 item / nhóm
  const groupedCompanies = [];
  for (let i = 0; i < companies.length; i += ITEMS_PER_GROUP) {
    groupedCompanies.push(companies.slice(i, i + ITEMS_PER_GROUP));
  }

  // Auto slide
  useEffect(() => {
    if (groupedCompanies.length === 0 || isManual) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % groupedCompanies.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [groupedCompanies.length, isManual]);

  // Fetch job cho nhóm hiện tại (có cache)
  useEffect(() => {
    const fetchJobs = async () => {
      const currentGroup = groupedCompanies[index];
      if (!currentGroup) return;

      const hasCache = currentGroup.every((com) => jobsByCompany[com._id]);
      if (hasCache) return;

      const result = { ...jobsByCompany };
      for (const com of currentGroup) {
        try {
          const jobs = await getJobByCompany(com._id);
          result[com._id] = Array.isArray(jobs) ? jobs.slice(0, 3) : [];
        } catch (err) {
          console.error(`❌ Error fetching jobs for ${com.name}`, err);
          result[com._id] = [];
        }
      }
      setJobsByCompany(result);
    };

    if (groupedCompanies.length) fetchJobs();
  }, [index, groupedCompanies]);

  if (!groupedCompanies.length) return null;

  // Điều hướng nhóm
  const handleNext = () => {
    setIsManual(true);
    setDirection(1);
    setIndex((prev) => (prev + 1) % groupedCompanies.length);
  };

  const handlePrev = () => {
    setIsManual(true);
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? groupedCompanies.length - 1 : prev - 1));
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
        Jobs by <span className="text-[#6A38C2]">Company</span>
      </h2>

      {/* Nút điều hướng hai bên */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-3 shadow-md hover:bg-gray-100 hover:scale-105 transition"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-3 shadow-md hover:bg-gray-100 hover:scale-105 transition"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Slide animation */}
      <div className="relative">
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {groupedCompanies[index].map((com) => (
              <div
                key={com._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Header company */}
                <div className="flex items-center gap-3 py-4 px-5 bg-gray-50 border-b border-gray-100">
                  <img
                    src={com.logo || "https://via.placeholder.com/40"}
                    alt={com.name}
                    className="w-10 h-10 object-contain border rounded-md bg-white"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{com.name}</p>
                    <p className="text-sm text-gray-500">
                      Top reputable company
                    </p>
                  </div>
                </div>

                {/* Job list */}
                <div className="p-5 space-y-3">
                  {jobsByCompany[com._id]?.length ? (
                    jobsByCompany[com._id].map((job) => (
                      <div
                        key={job._id}
                        onClick={() => navigate(`/job/${job._id}`)}
                        className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:border-[#6A38C2] hover:shadow-sm transition cursor-pointer"
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
                          <p className="font-medium text-gray-800 text-sm line-clamp-1">
                            {job.title}
                          </p>
                          <div className="text-xs text-gray-500 line-clamp-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{" "}
                            {formatLocation(job.location) || "Unknown"}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <DollarSign className="w-3 h-3 text-green-500" />{" "}
                            {formatSalary(job.salary) || "Negotiable"}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No jobs found
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-center">
                  <button
                    onClick={() => navigate(`/company/${com._id}`)}
                    className="text-sm text-[#6A38C2] font-medium hover:underline"
                  >
                    View all jobs at {com.name}
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Chỉ báo nhóm */}
      <div className="flex justify-center gap-2 mt-6">
        {groupedCompanies.map((_, i) => (
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

export default JobByCompanySection;

// Helpers
const formatLocation = (loc) => {
  if (!loc) return "No location info";
  if (typeof loc === "string") return loc;
  const { address, district, province } = loc || {};
  return [address, district, province].filter(Boolean).join(", ") || "N/A";
};

const formatSalary = (salary) => {
  if (!salary) return "Not specified";
  if (typeof salary === "string") return salary;
  const { min, max, currency, isNegotiable } = salary;
  if (isNegotiable) return "Negotiable";
  if (min && max)
    return `${min.toLocaleString()} - ${max.toLocaleString()} ${
      currency || "VND"
    }`;
  if (min) return `From ${min.toLocaleString()} ${currency || "VND"}`;
  if (max) return `Up to ${max.toLocaleString()} ${currency || "VND"}`;
  return "Not specified";
};
