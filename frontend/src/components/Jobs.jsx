import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSavedJobs from "@/hooks/useSavedJobs.jsx";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatLocation } from "../utils/formatLocation.js";
import { formatSalary } from "../utils/formatSalary.js";
import { Heart, Building2, Clock, CheckCircle2 } from "lucide-react";

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
    if (days === 0) return "Updated today";
    return `Updated ${days} days ago`;
  };

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="group bg-white border border-gray rounded-xl p-6 hover:border-[#6A38C2] hover:shadow-md transition-all duration-300 cursor-pointer w-full flex gap-5 items-start relative"
    >
      <div className="flex-shrink-0">
        <div className="h-24 w-24 rounded-xl border border-gray-100 bg-white p-2 flex items-center justify-center shadow-sm">
          <Avatar className="h-full w-full rounded-lg bg-transparent">
            <AvatarImage
              src={job?.company?.logo}
              className="object-contain"
              alt={job?.company?.name}
            />
            <AvatarFallback className="rounded-lg bg-gray-50 text-gray-400">
              <Building2 size={36} />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between h-full gap-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#6A38C2] transition-colors leading-tight line-clamp-1">
              {job?.title}
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <CheckCircle2
                    size={18}
                    className="text-blue-500 fill-blue-50"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Verified Job</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex-shrink-0">
            <span className="font-bold text-[#6A38C2] text-lg">
              {formatSalary(job?.salary)}
            </span>
          </div>
        </div>

        <div className="mb-2">
          <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
            {job?.company?.name}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
            {formatLocation(job?.location)}
          </span>
          {job?.experienceLevel > 0 ? (
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
              {job.experienceLevel} Years Exp
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
              No Experience
            </span>
          )}
        </div>

        <div className="flex items-end justify-between mt-auto pt-2 border-t border-dashed border-gray-100">
          <div className="text-xs text-gray-400 truncate max-w-[60%]">
            {job?.description ? "IT - Software • Full-time" : "General"}
            {/* Mocking skill text similar to image */}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 italic">
              {daysAgo(job?.createdAt)}
            </span>
            <Button
              variant="outline"
              size="icon"
              className={`h-9 w-9 rounded-full border transition-all ${
                isSaved
                  ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                  : "border-gray-200 text-gray-400 hover:border-[#6A38C2] hover:text-[#6A38C2] hover:bg-purple-50"
              }`}
              onClick={handleSaveClick}
            >
              <Heart size={18} className={isSaved ? "fill-current" : ""} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Job;
