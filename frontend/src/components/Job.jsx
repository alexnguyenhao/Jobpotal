import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSavedJobs from "@/hooks/useSavedJobs.jsx";
import { toast } from "sonner";
// UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatLocation } from "../utils/formatLocation.js";
import { formatSalary } from "../utils/formatSalary.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icons
import {
  Bookmark,
  BookmarkCheck,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Building2,
  BadgeCheck,
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
      toast.info("Unsaved job successfully!");
    } else {
      await saveJob(job._id);
      setIsSaved(true);
      toast.success("Saved job successfully!");
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
      className="group relative bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-purple-100 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* --- HEADER --- */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex gap-3 items-start overflow-hidden">
          {/* Company Logo Container */}
          <div className="h-12 w-12 flex-shrink-0 rounded-lg border border-gray-100 bg-white p-1 flex items-center justify-center shadow-sm">
             <Avatar className="h-full w-full rounded-md bg-transparent">
                <AvatarImage src={job?.company?.logo} className="object-contain" />
                <AvatarFallback className="rounded-md bg-gray-50 text-gray-400">
                  <Building2 size={20} />
                </AvatarFallback>
             </Avatar>
          </div>

          {/* Job Title & Company Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 leading-tight truncate group-hover:text-[#6A38C2] transition-colors">
              {job?.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1 truncate">
              {job?.company?.name}
              <span className="text-blue-500 inline-block" title="Đã xác minh">
                <BadgeCheck size={14} />
              </span>
            </p>
          </div>
        </div>

        {/* Save Button (Top Right) */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-full flex-shrink-0 transition-colors ${
                  isSaved
                    ? "text-[#6A38C2] bg-purple-50 hover:bg-purple-100"
                    : "text-gray-400 hover:text-[#6A38C2] hover:bg-gray-50"
                }`}
                onClick={handleSaveClick}
              >
                {isSaved ? (
                  <BookmarkCheck size={18} fill="#6A38C2" />
                ) : (
                  <Bookmark size={18} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isSaved ? "Unsave job" : "Save job"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* --- TAGS ROW --- */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge
          variant="outline"
          className="bg-white text-gray-600 border-gray-200 font-medium px-2.5 py-0.5 text-xs rounded-md flex items-center gap-1"
        >
          <MapPin size={12} className="text-gray-400" /> {formatLocation(job?.location)}
        </Badge>

        <Badge
          variant="outline"
          className="bg-white text-blue-600 border-blue-100 font-medium px-2.5 py-0.5 text-xs rounded-md flex items-center gap-1"
        >
          <Briefcase size={12} className="text-blue-400" /> {job?.jobType?.join(", ") || "Full-time"}
        </Badge>

        <Badge
          variant="outline"
          className="bg-white text-green-600 border-green-100 font-medium px-2.5 py-0.5 text-xs rounded-md flex items-center gap-1"
        >
          <DollarSign size={12} className="text-green-400" /> {formatSalary(job?.salary)}
        </Badge>
      </div>

      {/* --- DESCRIPTION --- */}
      <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow leading-relaxed">
        {job?.description || "No description provided."}
      </p>

      {/* --- FOOTER --- */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
        <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
          <Clock size={14} /> 
          <span>{daysAgo(job?.createdAt)}</span>
        </div>

        <Button 
            variant="outline"
            className="h-8 px-4 text-xs font-semibold border-[#6A38C2] text-[#6A38C2] hover:bg-[#6A38C2] hover:text-white transition-all rounded-md group-hover:bg-[#6A38C2] group-hover:text-white shadow-sm"
        >
          Apply Now
        </Button>
      </div>
    </div>
  );
};

export default Job;