import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSavedJobs from "@/hooks/useSavedJobs.jsx";
import { toast } from "sonner";

// Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Utils & Icons
import { formatLocation } from "../utils/formatLocation.js";
import { formatSalary } from "../utils/formatSalary.js";
import {
  Bookmark,
  BookmarkCheck,
  Building2,
  Clock,
  MapPin,
  Briefcase,
} from "lucide-react";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const { savedJobs, saveJob, unsaveJob } = useSavedJobs();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = savedJobs?.some((j) => (j._id || j).toString() === job?._id);
    setIsSaved(saved);
  }, [savedJobs, job?._id]);

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    if (isSaved) {
      await unsaveJob(job._id);
      setIsSaved(false);
      toast.info("Removed from saved jobs");
    } else {
      await saveJob(job._id);
      setIsSaved(true);
      toast.success("Job saved successfully");
    }
  };

  const daysAgo = (dateString) => {
    if (!dateString) return "Just now";
    const days = Math.floor(
      (new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24)
    );
    return days === 0 ? "Today" : `${days} days ago`;
  };

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="group bg-white border border-gray-300 rounded-xl p-5 hover:border-[#6A38C2] hover:shadow-md transition-all duration-300 cursor-pointer w-full flex flex-col sm:flex-row gap-4 items-start"
    >
      <div className="flex-shrink-0">
        <div className="h-20 w-20 rounded-lg border border-gray-100 bg-white p-2 flex items-center justify-center">
          <Avatar className="h-full w-full rounded-md bg-transparent">
            <AvatarImage
              src={job?.company?.logo}
              className="object-contain"
              alt={job?.company?.name}
            />
            <AvatarFallback className="rounded-md bg-gray-50 text-gray-400">
              <Building2 size={32} />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#6A38C2] transition-colors leading-tight line-clamp-2">
              {job?.title}
            </h3>
            <p className="text-gray-500 font-medium text-sm mt-1 truncate">
              {job?.company?.name}
            </p>
          </div>

          <div className="sm:hidden block">
            <span className="font-bold text-[#6A38C2] text-sm whitespace-nowrap">
              {formatSalary(job?.salary)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-1">
          <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <MapPin size={12} />
            <span className="truncate max-w-[150px]">
              {formatLocation(job?.location)}
            </span>
          </div>

          <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Briefcase size={12} />
            <span>{job?.jobType?.[0] || "Full-time"}</span>
          </div>

          {job?.experienceLevel && (
            <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
              {job.experienceLevel} year
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-row sm:flex-col justify-between items-end sm:items-end w-full sm:w-auto sm:h-full gap-4 sm:gap-0 mt-2 sm:mt-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-dashed border-gray-100">
        <div className="hidden sm:block">
          <span className="font-bold text-[#6A38C2] text-base whitespace-nowrap">
            {formatSalary(job?.salary)}
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-2 ml-auto sm:ml-0">
          <span className="text-xs text-gray-400 font-medium flex items-center gap-1 whitespace-nowrap">
            <Clock size={12} />
            {daysAgo(job?.createdAt)}
          </span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-full transition-colors ${
                    isSaved
                      ? "text-red-500 bg-red-50 hover:bg-red-100"
                      : "text-gray-300 hover:text-[#6A38C2] hover:bg-gray-50"
                  }`}
                  onClick={handleSaveClick}
                >
                  {isSaved ? (
                    <BookmarkCheck size={20} fill="currentColor" />
                  ) : (
                    <Bookmark size={20} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isSaved ? "Remove from saved" : "Save job"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default Job;
