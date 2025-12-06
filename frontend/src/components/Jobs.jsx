import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetJobs } from "@/hooks/useGetJobs";
import { motion } from "framer-motion";
import JobFilterBar from "./FilterCard";
import JobSidebar from "./JobSidebar";
import Job from "@/components/Job.jsx";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
      <div className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-8xl mx-auto px-4 py-4 md:px-8">
          <JobFilterBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block w-[280px] flex-shrink-0">
            <JobSidebar />
          </div>

          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex gap-2">
                  <Menu className="w-4 h-4" /> Filters & Sort
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] sm:w-[400px] overflow-y-auto"
              >
                <JobSidebar />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="w-5 h-5 text-[#6A38C2]" />
                <span className="font-medium">
                  {loading ? "Searching..." : `Found ${totalJobs} jobs`}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className="h-[180px] bg-white rounded-xl border border-gray-100 p-6 space-y-4 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <Skeleton className="h-24 w-24 rounded-lg" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {totalJobs === 0 ? (
                  <div className="flex flex-col justify-center items-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
                    <p className="text-gray-500">No jobs found.</p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col gap-4"
                  >
                    {currentJobs.map((job) => (
                      <Job key={job?._id} job={job} />
                    ))}
                  </motion.div>
                )}

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <Button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <span className="text-sm font-medium">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
