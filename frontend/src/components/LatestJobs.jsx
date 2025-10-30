import React from "react";
import LatestJobCards from "@/components/LatestJobCards";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);

  return (
    <section className="max-w-7xl mx-auto my-16 px-4">
      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8">
        <span className="text-[#6A38C2]">Latest & Top&nbsp;</span>
        Job Openings
      </h1>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allJobs?.length > 0 ? (
          allJobs
            .slice(0, 6)
            .map((job) => <LatestJobCards key={job._id} job={job} />)
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500 font-medium border border-dashed border-gray-200 rounded-xl bg-white shadow-sm">
            No jobs available
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestJobs;
