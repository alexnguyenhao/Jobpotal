import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.js";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar.js";
import { Badge } from "@/components/ui/badge.js";
import { useNavigate } from "react-router-dom";
import { CalendarDays, DollarSign } from "lucide-react";
import useSavedJobs from "@/hooks/useSavedJobs.jsx";
import { toast } from "sonner";

const Jobs = ({ job }) => {
  const navigate = useNavigate();
  const { savedJobs, saveJob, unsaveJob } = useSavedJobs();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = savedJobs?.some((j) => (j._id || j).toString() === job?._id);
    setIsSaved(saved);
  }, [savedJobs, job?._id]);

  const handleCardClick = () => navigate(`/description/${job._id}`);

  const handleSaveClick = async () => {
    if (isSaved) {
      await unsaveJob(job._id);
      setIsSaved(false);
      toast.info("Removed from saved jobs");
    } else {
      await saveJob(job._id);
      setIsSaved(true);
      toast.success("Job saved successfully!");
    }
  };

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentAt = new Date();
    const timeDifference = currentAt - createdAt;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-md hover:shadow-lg transition duration-300 flex flex-col justify-between h-full">
      {/* Top Row */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <p>{daysAgoFunction(job?.createdAt)}</p>
        <Button
          variant="ghost"
          size="icon"
          className={`hover:text-[#7209B7] transition-all ${
            isSaved ? "text-[#7209B7]" : "text-gray-400"
          }`}
          onClick={handleSaveClick}
        >
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-12 w-12 hover:shadow-md transition duration-300">
          <AvatarImage src={job?.company?.logo} />
        </Avatar>
        <div>
          <h2
            onClick={() => navigate(`/company/${job.company?._id}`)}
            className="font-semibold text-gray-800 text-base truncate hover:underline cursor-pointer"
          >
            {job?.company?.name}
          </h2>
          <p className="text-sm text-gray-500 hover:underline cursor-pointer">
            {job?.location?.province || "N/A"}
          </p>
        </div>
      </div>

      {/* Job Title */}
      <div className="mb-3">
        <h1
          onClick={handleCardClick}
          className="font-bold text-lg text-[#7209B7] line-clamp-1 hover:underline cursor-pointer"
        >
          {job?.title}
        </h1>
        <p className="text-sm text-gray-600 line-clamp-2">{job?.description}</p>
      </div>

      {/* Salary & Deadline */}
      <div className="flex flex-wrap items-center gap-3 mt-2 mb-5">
        <Badge
          className="text-[#7209B7] font-medium flex items-center gap-1"
          variant="outline"
        >
          <DollarSign className="w-4 h-4" />
          {formatSalary(job?.salary)}
        </Badge>

        {job?.applicationDeadline && (
          <Badge
            className="text-green-700 font-medium flex items-center gap-1"
            variant="outline"
          >
            <CalendarDays className="w-4 h-4" />
            Deadline:{" "}
            {new Date(job?.applicationDeadline).toLocaleDateString("en-GB")}
          </Badge>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-2 mt-auto">
        <Button
          variant="outline"
          className="w-1/2 text-sm"
          onClick={handleCardClick}
        >
          View
        </Button>

        <Button
          onClick={handleSaveClick}
          className={`w-1/2 text-sm transition-all ${
            isSaved
              ? "bg-[#6A38C2] text-white hover:bg-[#5e0994]"
              : "bg-gray-100 text-[#7209B7] border border-[#7209B7] hover:bg-[#f7edff]"
          }`}
        >
          {isSaved ? "Saved" : "Save Job"}
        </Button>
      </div>
    </div>
  );
};

// ✅ Helper: Format Salary
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

export default Jobs;
