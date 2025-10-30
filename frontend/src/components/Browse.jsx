import React from "react";
import NavBar from "@/components/shared/NavBar.jsx";
import Job from "@/components/Job.jsx";

const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const Browse = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <h1 className="font-bold text-xl">
          Search Results ({randomJobs.length})
        </h1>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {randomJobs.map((item, index) => {
            return <Job />;
          })}
        </div>
      </div>
    </div>
  );
};
export default Browse;
