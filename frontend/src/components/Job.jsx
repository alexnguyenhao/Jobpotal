import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useSavedJobs from "@/hooks/useSavedJobs.jsx";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatLocation } from "../utils/formatLocation.js";
import { formatSalary } from "../utils/formatSalary.js";
import {
  Heart,
  Building2,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  RotateCcw,
  Send,
} from "lucide-react";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const { savedJobs, saveJob, unsaveJob } = useSavedJobs();
  const [isSaved, setIsSaved] = useState(false);

  const MAX_APPLY_LIMIT = 3;
  const myApplications =
    job?.applications?.filter(
      (app) => app.applicant === user?._id || app === user?._id
    ) || [];

  const applyCount = myApplications.length;
  const isApplied = applyCount > 0;
  const isMaxApplied = applyCount >= MAX_APPLY_LIMIT;

  const isNew = (dateString) => {
    const days = Math.floor(
      (new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24)
    );
    return days <= 3;
  };

  useEffect(() => {
    const saved = savedJobs?.some((j) => (j._id || j).toString() === job?._id);
    setIsSaved(saved);
  }, [savedJobs, job?._id]);

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    if (isSaved) {
      await unsaveJob(job._id);
      setIsSaved(false);
      toast.info("Job unsaved");
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
    if (days === 0) return "Today";
    return `${days} days ago`;
  };

  const getDisplaySkills = () => {
    if (!job?.professional || job.professional.length === 0) return "";
    const skills = Array.isArray(job.professional)
      ? job.professional
      : [job.professional];

    // Display roughly the first 3-4 items or truncate text
    if (skills.length <= 4) return skills.join(" | ");

    const visible = skills.slice(0, 3).join(" | ");
    return `${visible} | +${skills.length - 3}`;
  };

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className={`group relative bg-white border rounded-lg p-5 transition-all duration-200 cursor-pointer hover:shadow-md hover:border-[#6A38C2]
        ${isApplied ? "bg-purple-50/10 border-purple-200" : "border-gray-200"}
      `}
    >
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Logo Section */}
        <div className="shrink-0">
          <div className="w-[88px] h-[88px] rounded-lg border border-gray-100 bg-white p-2 flex items-center justify-center shadow-sm">
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

        {/* Content Section */}
        <div className="flex-1 min-w-0 w-full flex flex-col h-full justify-between">
          {/* Top Row: Title & Salary */}
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-1.5">
              <div className="flex items-center flex-wrap gap-2">
                {/* New Badge */}
                {isNew(job?.createdAt) && (
                  <Badge
                    variant="default"
                    className="bg-[#6A38C2] hover:bg-[#5b32a8] text-[10px] h-5 px-1.5 font-bold rounded"
                  >
                    NEW
                  </Badge>
                )}

                {/* Job Title - Changes color on hover */}
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#6A38C2] transition-colors leading-tight line-clamp-1">
                  {job?.title}
                </h3>

                {/* Verified Icon */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <CheckCircle2
                        size={16}
                        className="text-gray-400 group-hover:text-[#6A38C2] transition-colors"
                      />
                    </TooltipTrigger>
                    <TooltipContent>Verified Company</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Applied Badge */}
                {isApplied && (
                  <Badge
                    variant="outline"
                    className="border-green-500 text-green-600 bg-green-50 text-[10px] h-5 px-1.5 gap-1"
                  >
                    <CheckCircle2 size={10} /> Applied
                  </Badge>
                )}
              </div>

              {/* Company Name */}
              <p className="text-gray-500 font-medium text-sm uppercase tracking-wide truncate pr-4">
                {job?.company?.name}
              </p>
            </div>

            {/* Salary */}
            <div className="text-right shrink-0">
              <span className="block font-bold text-[#00B14F] text-base">
                {formatSalary(job?.salary)}
              </span>
            </div>
          </div>

          {/* Middle Row: Chips/Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-3 mb-3">
            <div className="inline-flex items-center px-3 py-1 rounded bg-[#F3F5F7] text-gray-600 text-xs font-medium">
              {formatLocation(job?.location)}
            </div>
            {job?.experienceLevel && (
              <div className="inline-flex items-center px-3 py-1 rounded bg-[#F3F5F7] text-gray-600 text-xs font-medium">
                {job.experienceLevel}
              </div>
            )}
          </div>

          {/* Bottom Row: Skills & Actions */}
          <div className="flex items-end justify-between mt-auto pt-1">
            {/* Skills Text (Truncated) */}
            <div className="flex-1 min-w-0 mr-4 pb-1">
              <p
                className="text-xs text-gray-500 truncate"
                title={
                  Array.isArray(job?.professional)
                    ? job.professional.join(", ")
                    : ""
                }
              >
                {getDisplaySkills()}
              </p>
            </div>

            {/* Actions Area: Swaps Time for Apply Button on Hover */}
            <div className="flex items-center gap-3 shrink-0 h-9">
              {/* Logic: If NOT applied and NOT maxed out, show apply button on hover. 
                    If applied, show Reapply/Status. */}

              {/* 1. Time Display (Hidden on group hover) */}
              <span className="text-xs text-gray-400 group-hover:hidden transition-all duration-200">
                {daysAgo(job?.createdAt)}
              </span>

              {/* 2. Apply Button (Visible on group hover) */}
              <div className="hidden group-hover:flex items-center animate-in fade-in zoom-in-95 duration-200">
                {isMaxApplied ? (
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
                    Max Applied
                  </span>
                ) : (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/description/${job._id}`);
                    }}
                    size="sm"
                    className={`h-8 px-4 text-xs font-bold shadow-sm rounded-full transition-all
                            ${
                              isApplied
                                ? "bg-white text-green-600 border border-green-200 hover:bg-green-50"
                                : "bg-[#6A38C2] text-white hover:bg-[#5b32a8]"
                            }
                        `}
                  >
                    {isApplied ? (
                      <>
                        <RotateCcw size={13} className="mr-1.5" /> Reapply
                      </>
                    ) : (
                      <>
                        <Send size={13} className="mr-1.5" /> Apply Now
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* 3. Save Button (Always Visible) */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 rounded-full border transition-all ${
                        isSaved
                          ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                          : "border-gray-200 text-gray-400 hover:border-[#6A38C2] hover:text-[#6A38C2] hover:bg-purple-50"
                      }`}
                      onClick={handleSaveClick}
                    >
                      <Heart
                        size={16}
                        className={isSaved ? "fill-current" : ""}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isSaved ? "Unsave" : "Save Job"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Job;
