import React, { useState } from "react";
import JobFilterBar from "./FilterCard";
import Job from "@/components/Job.jsx";
import { useSelector } from "react-redux";
import { useGetJobs } from "@/hooks/useGetJobs";

// Số job mỗi trang (tuỳ bạn chỉnh)
const ITEMS_PER_PAGE = 9;

const Jobs = () => {
  useGetJobs();
  const { allJobs } = useSelector((store) => store.job);

  // Pagination state
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(allJobs.length / ITEMS_PER_PAGE);

  // Jobs cho trang hiện tại
  const currentJobs = allJobs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen mx-auto px-4 md:px-8 space-y-8">
        {/* FILTER BAR */}
        <section className="sticky top-0 z-30 bg-gray-50/90 backdrop-blur-md border-b border-gray-200">
          <JobFilterBar />
        </section>

        {/* JOB LIST */}
        <section className="pt-6 min-h-[70vh]">
          {currentJobs.length === 0 ? (
            <div className="flex justify-center items-center h-[60vh] text-gray-500 text-lg font-medium">
              🧐 No jobs found matching your filters.
            </div>
          ) : (
            <>
              {/* JOB GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentJobs.map((job) => (
                  <Job key={job?._id} job={job} />
                ))}
              </div>

              {/* PAGINATION */}
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (num) => (
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
                    )
                  )}

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
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Jobs;
