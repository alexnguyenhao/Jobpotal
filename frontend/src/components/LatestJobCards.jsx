import React from "react";
import { Badge } from "@/components/ui/badge.js";
import { useNavigate } from "react-router-dom";
import { CalendarDays, DollarSign } from "lucide-react";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/description/${job._id}`);
  };
  return (
    <div
      className="p-5 rounded-xl shadow-md bg-white border border-gray-100 cursor-pointer hover:shadow-lg transition duration-300"
      onClick={handleCardClick}
    >
      {/* Company Info */}
      <div className="mb-2">
        <h2 className="font-semibold text-base text-gray-800 truncate">
          {job?.company?.name}
        </h2>
        <p className="text-sm text-gray-500">{job?.location.province}</p>
      </div>

      {/* Job Title & Description */}
      <div className="mb-3">
        <h1 className="font-bold text-lg text-blue-800 truncate">
          {job?.title}
        </h1>
        <p className="text-sm text-gray-600 line-clamp-2">{job?.description}</p>
      </div>

      {/* Salary & Deadline */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <Badge
          className="text-[#7209B7] font-medium flex items-center gap-1"
          variant="outline"
        >
          <DollarSign className="w-4 h-4" />
          {formatSalary(job?.salary)}
        </Badge>

        <Badge
          className="text-green-700 font-medium flex items-center gap-1"
          variant="outline"
        >
          <CalendarDays className="w-4 h-4" />
          {job?.applicationDeadline
            ? new Date(job.applicationDeadline).toLocaleDateString("en-GB")
            : "No deadline"}
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
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
