import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetJobs } from "@/hooks/useGetJobs";
import { motion } from "framer-motion";

// Components
import JobFilterBar from "./FilterCard";
import Job from "@/components/Job.jsx";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import { Briefcase, ArrowLeft, ArrowRight } from "lucide-react";

const ITEMS_PER_PAGE = 9;

const Jobs = () => {
  useGetJobs(); 
  const { allJobs, loading } = useSelector((store) => store.job);

  const [page, setPage] = useState(1);

    
  const totalJobs = allJobs.length;
  const totalPages = Math.ceil(totalJobs / ITEMS_PER_PAGE);
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const currentJobs = allJobs.slice(startIdx, endIdx);

  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      
      <div className=" top-[68px] z-30 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-8">
          <JobFilterBar />
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="w-5 h-5 text-[#6A38C2]" />
            <span className="font-medium">
              {loading
                ? "Searching..."
                : `Showing ${currentJobs.length} of ${totalJobs} jobs`}
            </span>
          </div>
        </div>

        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-[280px] bg-white rounded-xl border border-gray-100 p-6 space-y-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mt-4" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-8 flex justify-between">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {totalJobs === 0 ? (
              
              <div className="flex flex-col justify-center items-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <Briefcase className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  No jobs found
                </h3>
                <p className="text-gray-500 mt-2 max-w-xs">
                  We couldn't find any jobs matching your current filters. Try
                  adjusting your search criteria.
                </p>
              </div>
            ) : (
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {currentJobs.map((job) => (
                  <Job key={job?._id} job={job} />
                ))}
              </motion.div>
            )}

            
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="h-10 px-4 border-gray-300 text-gray-600 hover:text-[#6A38C2] hover:border-[#6A38C2] hover:bg-purple-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                </Button>

                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (num) => {
                      
                      if (
                        totalPages > 7 &&
                        Math.abs(num - page) > 2 &&
                        num !== 1 &&
                        num !== totalPages
                      ) {
                        if (Math.abs(num - page) === 3)
                          return (
                            <span key={num} className="text-gray-400">
                              ...
                            </span>
                          );
                        return null;
                      }

                      return (
                        <button
                          key={num}
                          onClick={() => setPage(num)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                            num === page
                              ? "bg-[#6A38C2] text-white shadow-md scale-105"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {num}
                        </button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="h-10 px-4 border-gray-300 text-gray-600 hover:text-[#6A38C2] hover:border-[#6A38C2] hover:bg-purple-50 transition-colors"
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;
