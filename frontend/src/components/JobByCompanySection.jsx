import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getJobByCompany } from "@/hooks/useGetJobs";
import { useNavigate } from "react-router-dom";
import { MapPin, DollarSign, Building2 } from "lucide-react";

const JobByCompanySection = () => {
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);
  const [jobsByCompany, setJobsByCompany] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!companies?.length) return;

      setLoading(true);
      let result = {};

      // 🔁 Lấy 3 công ty đầu tiên để hiển thị
      for (const com of companies.slice(0, 3)) {
        try {
          const jobs = await getJobByCompany(com._id);
          result[com._id] = jobs.slice(0, 3); // Lấy 3 job đầu tiên của công ty
        } catch (err) {
          console.error(`❌ Error fetching jobs for company ${com.name}`, err);
          result[com._id] = [];
        }
      }

      setJobsByCompany(result);
      setLoading(false);
    };

    fetchJobs();
  }, [companies]);

  if (loading) {
    return (
      <div className="w-full text-center py-10 text-gray-500 font-medium">
        Loading jobs by company...
      </div>
    );
  }

  if (!companies?.length) return null;

  return (
    <section className="my-16 w-full max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Jobs by <span className="text-[#6A38C2]">Company</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {companies.slice(0, 3).map((com) => (
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
                <p className="text-sm text-gray-500">Top reputable company</p>
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
                        job.company?.logo || "https://via.placeholder.com/50"
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
                  Jobs not found
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
      </div>
    </section>
  );
};

export default JobByCompanySection;
const formatLocation = (loc) => {
  if (!loc) return "No location info";
  if (typeof loc === "string") return loc;
  if (typeof loc === "object") {
    const { address, district, province } = loc;
    return [address, district, province].filter(Boolean).join(", ");
  }
  return "N/A";
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
