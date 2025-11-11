import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getJobByCategory } from "@/hooks/useGetJobs";
import { useNavigate } from "react-router-dom";
import { MapPin, DollarSign } from "lucide-react";

const JobByCategorySection = () => {
  const navigate = useNavigate();
  const { categories } = useSelector((store) => store.category);

  const [jobsByCategory, setJobsByCategory] = useState({});
  const [index, setIndex] = useState(0);

  const ITEMS_PER_GROUP = 3;
  const INTERVAL = 10000;

  const groupedCategories = [];
  for (let i = 0; i < categories.length; i += ITEMS_PER_GROUP) {
    groupedCategories.push(categories.slice(i, i + ITEMS_PER_GROUP));
  }
  useEffect(() => {
    if (groupedCategories.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % groupedCategories.length);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [groupedCategories.length]);

  useEffect(() => {
    const fetchJobs = async () => {
      let result = {};

      const currentGroup = groupedCategories[index] || [];

      for (const cat of currentGroup) {
        const jobs = await getJobByCategory(cat._id);
        result[cat._id] = jobs.slice(0, 3); // lấy 3 job
      }

      setJobsByCategory(result);
    };

    if (groupedCategories.length) fetchJobs();
  }, [index, groupedCategories]);
  if (!groupedCategories.length) return null;

  return (
    <section className="my-10 w-full max-w-7xl mx-auto px-4 transition-all duration-500">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Jobs by <span className="text-[#6A38C2]">Category</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupedCategories[index].map((cat) => (
          <div
            key={cat._id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* Category Header */}
            <div className="py-3 px-4 bg-gray-100 text-center font-semibold text-lg text-gray-800">
              {cat.name}
            </div>

            {/* Job list */}
            <div className="p-4 space-y-3">
              {jobsByCategory[cat._id]?.length ? (
                jobsByCategory[cat._id].map((job) => (
                  <div
                    key={job._id}
                    className="flex gap-3 p-3 border border-gray-200 rounded-lg hover:shadow transition cursor-pointer"
                    onClick={() => navigate(`description/${job._id}`)}
                  >
                    {/* Logo */}
                    <img
                      src={
                        job.company?.logo || "https://via.placeholder.com/50"
                      }
                      alt="logo"
                      className="w-12 h-12 object-contain rounded-md border"
                    />

                    {/* Job info */}
                    <div className="flex-1">
                      <p className="font-semibold text-[15px] text-gray-800 line-clamp-1">
                        {job.title}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {job.company?.name}
                      </p>

                      <div className="flex items-center text-[13px] text-red-500">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Lương:{" "}
                        {job.salary?.type === "range"
                          ? `${job.salary.min} – ${job.salary.max} VND`
                          : job.salary?.value || "Cạnh Tranh"}
                      </div>

                      <div className="flex items-center text-[13px] text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location?.province}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No jobs available.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JobByCategorySection;
