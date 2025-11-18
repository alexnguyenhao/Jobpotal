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
  ExternalLink,
  Building2,
  MapPin,
  BookmarkX,
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
      <div className="space-y-3 py-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-white border rounded-lg"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (!savedJobs || savedJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-200 text-center">
        <div className="bg-gray-50 p-4 rounded-full mb-3">
          <BookmarkX className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-gray-900 font-semibold text-lg">No Saved Jobs</h3>
        <p className="text-gray-500 text-sm mt-1">
          Jobs you save will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-sm bg-white border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-[350px] py-4 font-semibold text-gray-700">
              Job & Company
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Location
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700 pr-6">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {savedJobs.map((job) => (
            <TableRow
              key={job._id}
              className="hover:bg-slate-50 transition-colors group"
            >
              {/* 1. Job Info */}
              <TableCell className="py-4">
                <div className="flex items-center gap-4">
                  <Avatar
                    className="h-10 w-10 rounded-lg border bg-white cursor-pointer"
                    onClick={() => navigate(`/company/${job.company?._id}`)}
                  >
                    <AvatarImage src={job.company?.logo} objectFit="contain" />
                    <AvatarFallback className="rounded-lg bg-gray-100 text-gray-500 font-bold">
                      {job.company?.name?.charAt(0) || "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3
                      onClick={() => navigate(`/description/${job._id}`)}
                      className="font-semibold text-gray-900 hover:text-[#6A38C2] hover:underline transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {job.title}{" "}
                      <ExternalLink size={12} className="text-gray-400" />
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <Building2 size={10} />{" "}
                      {job.company?.name || "Unknown Company"}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* 2. Location */}
              <TableCell className="text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-gray-400" />
                  {job.location?.province || "Remote"}
                </div>
              </TableCell>

              {/* 3. Actions */}
              <TableCell className="text-right pr-6">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    className="bg-[#6A38C2] hover:bg-[#592ba3] text-white h-8 text-xs"
                    onClick={() => navigate(`/description/${job._id}`)}
                  >
                    Apply Now
                  </Button>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => unsaveJob(job._id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Remove from saved</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SavedJobTable;
