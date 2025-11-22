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

  // Check if job is saved
  useEffect(() => {
    const saved = savedJobs?.some((j) => (j._id || j).toString() === job?._id);
    setIsSaved(saved);
  }, [savedJobs, job?._id]);

  const handleSaveClick = async (e) => {
    e.stopPropagation(); // Prevent card click
    if (isSaved) {
      await unsaveJob(job._id);
      setIsSaved(false);
      toast.info("Job removed from saved list");
    } else {
      await saveJob(job._id);
      setIsSaved(true);
      toast.success("Job saved successfully!");
    }
  };
  const daysAgo = (dateString) => {
    if (!dateString) return "Recently";
    const days = Math.floor(
      (new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24)
    );
    return days === 0 ? "Today" : `${days}d ago`;
  };

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="group relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-[#6A38C2]/30 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* --- HEADER: Logo & Title --- */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex gap-4">
          <Avatar className="h-14 w-14 rounded-xl border bg-white shadow-sm group-hover:scale-105 transition-transform">
            <AvatarImage src={job?.company?.logo} objectFit="object-contain" />
            <AvatarFallback className="rounded-xl bg-gray-50 text-gray-400">
              <Building2 size={24} />
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-1 group-hover:text-[#6A38C2] transition-colors">
              {job?.title}
            </h3>
            <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
              {job?.company?.name}
              {/* Verified Badge (Optional) */}
              <span className="text-blue-500"><BadgeCheck size={14}/></span>
            </p>
          </div>
        </div>

        {/* Save Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 rounded-full -mr-2 -mt-2 ${
                  isSaved
                    ? "text-[#6A38C2] bg-purple-50"
                    : "text-gray-400 hover:text-[#6A38C2] hover:bg-purple-50"
                }`}
                onClick={handleSaveClick}
              >
                {isSaved ? (
                  <BookmarkCheck size={20} fill="#6A38C2" />
                ) : (
                  <Bookmark size={20} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isSaved ? "Unsave Job" : "Save Job"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* --- TAGS ROW --- */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Location */}
        <Badge
          variant="secondary"
          className="bg-gray-100 text-gray-600 font-normal px-2.5 py-1 rounded-md"
        >
          <MapPin size={13} className="mr-1" /> {formatLocation(job?.location)}
        </Badge>

        {/* Job Type */}
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 font-normal px-2.5 py-1 rounded-md"
        >
          <Briefcase size={13} className="mr-1" /> {job?.jobType.join(" ") || "Full-time"}
        </Badge>

        {/* Salary */}
        <Badge
          variant="secondary"
          className="bg-green-50 text-green-700 font-normal px-2.5 py-1 rounded-md"
        >
          <DollarSign size={13} className="mr-1" /> {formatSalary(job?.salary)}
        </Badge>
      </div>

      {/* --- DESCRIPTION (Excerpt) --- */}
      <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-grow leading-relaxed">
        {job?.description || "No description provided. Click to view details."}
      </p>

      {/* --- FOOTER: Time & Action --- */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
        <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
          <Clock size={13} /> Posted {daysAgo(job?.createdAt)}
        </div>

        <Button className="bg-[#6A38C2] hover:bg-[#582bb6] text-white h-9 px-5 rounded-lg text-xs font-semibold shadow-md group-hover:shadow-lg transition-all">
          Apply Now
        </Button>
      </div>
    </div>
  );
};
export default Job;
