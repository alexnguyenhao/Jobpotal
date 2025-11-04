import React from "react";
import JobFilterBar from "./FilterCard";
import Job from "@/components/Job.jsx";
import { useSelector } from "react-redux";
import useGetJobs from "@/hooks/useGetJobs"; // ✅ import hook mới

const Jobs = () => {
  useGetJobs(); // ✅ tự động fetch jobs
  const { allJobs } = useSelector((store) => store.job);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen mx-auto px-4 md:px-8 space-y-8">
        <section className="sticky top-0 z-30 bg-gray-50/90 backdrop-blur-md border-b border-gray-200">
          <JobFilterBar />
        </section>

        <section className="pt-6 min-h-[70vh]">
          {allJobs.length === 0 ? (
            <div className="flex justify-center items-center h-[60vh] text-gray-500 text-lg font-medium">
              🧐 No jobs found matching your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allJobs.map((job) => (
                <Job key={job?._id} job={job} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Jobs;
