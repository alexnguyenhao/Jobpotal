import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useSavedJobs from "@/hooks/useSavedJobs.jsx";
import { useNavigate } from "react-router-dom";

// UI Components
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icons
import {
  Trash2,
  Building2,
  MapPin,
  BookmarkX,
  Briefcase,
  Clock,
} from "lucide-react";

const SavedJobTable = () => {
  const { savedJobs, fetchSavedJobs, unsaveJob } = useSavedJobs();
  const { loading } = useSelector((store) => store.job);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="space-y-4 mt-5 max-w-7xl mx-auto px-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (!savedJobs || savedJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm mt-5 max-w-7xl mx-auto px-4">
        <div className="bg-purple-50 p-6 rounded-full mb-4 ring-8 ring-purple-50/50">
          <BookmarkX className="w-10 h-10 text-[#6A38C2]" />
        </div>
        <h3 className="text-gray-900 font-bold text-xl">No Saved Jobs Found</h3>
        <p className="text-gray-500 text-sm mt-2 max-w-xs text-center leading-relaxed">
          You haven't saved any jobs yet. Browse jobs and save the ones you're
          interested in!
        </p>
        <Button
          className="mt-6 bg-[#6A38C2] hover:bg-[#5b30a6]"
          onClick={() => navigate("/jobs")}
        >
          Browse Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Your Saved Jobs</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
          {savedJobs.length} Jobs Saved
        </span>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader className="bg-gray-50/80">
            <TableRow className="hover:bg-transparent border-b-gray-100">
              <TableHead className="w-[400px] py-5 pl-6 font-semibold text-gray-600">
                Job Details
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Location & Type
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-600 pr-6">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {savedJobs.map((job) => (
              <TableRow
                key={job._id}
                className="group hover:bg-purple-50/30 transition-all duration-200 border-b-gray-100 last:border-0"
              >
                {/* 1. Job Info */}
                <TableCell className="py-5 pl-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="h-12 w-12 min-w-[3rem] rounded-xl border border-gray-100 bg-white flex items-center justify-center p-1 shadow-sm cursor-pointer group-hover:border-[#6A38C2]/30 transition-colors"
                      onClick={() => navigate(`/company/${job.company?._id}`)}
                    >
                      <Avatar className="h-full w-full rounded-lg">
                        <AvatarImage
                          src={job.company?.logo}
                          className="object-contain"
                        />
                        <AvatarFallback className="rounded-lg bg-gray-50 text-[#6A38C2] font-bold text-lg">
                          {job.company?.name?.charAt(0) || "C"}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="space-y-1">
                      {/* FIX: Thêm truncate và max-w để cắt chữ nếu dài quá */}
                      <h3
                        onClick={() => navigate(`/description/${job._id}`)}
                        className="font-bold text-base text-gray-900 group-hover:text-[#6A38C2] transition-colors cursor-pointer block truncate max-w-[200px] sm:max-w-[300px]"
                        title={job.title} // Hiện tooltip khi hover chuột vào
                      >
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                        <span className="font-medium text-gray-700 flex items-center gap-1">
                          <Building2 size={14} className="text-gray-400" />
                          {job.company?.name}
                        </span>
                        <span className="text-gray-300 hidden sm:inline">
                          •
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={12} />
                          Recently added
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* 2. Location & Type */}
                <TableCell>
                  <div className="flex flex-col items-start gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200 whitespace-nowrap">
                      <MapPin size={12} />
                      {job.location?.province || "Remote"}
                    </div>
                    {job.jobType && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100 whitespace-nowrap">
                        <Briefcase size={12} />
                        {job.jobType}
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* 3. Actions */}
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            onClick={() => unsaveJob(job._id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 text-white border-0 text-xs">
                          Remove from saved
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Button
                      size="sm"
                      className="bg-white text-[#6A38C2] border border-[#6A38C2] hover:bg-[#6A38C2] hover:text-white shadow-none font-medium px-4 h-9 transition-all rounded-full group-hover:shadow-md whitespace-nowrap"
                      onClick={() => navigate(`/description/${job._id}`)}
                    >
                      Apply Now
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SavedJobTable;
