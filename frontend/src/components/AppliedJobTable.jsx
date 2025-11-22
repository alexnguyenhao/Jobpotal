import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import { 
  Building2, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Briefcase,
  CalendarDays
} from "lucide-react";

const AppliedJobTable = () => {
  const { allAppliedJobs, loading } = useSelector((store) => store.job);
  const navigate = useNavigate();

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="space-y-4 mt-5">
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
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (!allAppliedJobs || allAppliedJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm mt-5">
        <div className="bg-purple-50 p-6 rounded-full mb-4 ring-8 ring-purple-50/50">
          <Briefcase className="w-10 h-10 text-[#6A38C2]" />
        </div>
        <h3 className="text-gray-900 font-bold text-xl">No Applications Yet</h3>
        <p className="text-gray-500 text-sm mt-2 max-w-xs text-center leading-relaxed">
          You haven't applied for any jobs yet. Start your search and land your dream job!
        </p>
        <Button 
          className="mt-6 bg-[#6A38C2] hover:bg-[#5b30a6]"
          onClick={() => navigate("/jobs")}
        >
          Find Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-5 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Applied Jobs</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
          {allAppliedJobs.length} Applications
        </span>
      </div>

      {/* Table Section */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow className="hover:bg-transparent border-b-gray-100">
              <TableHead className="w-[400px] py-5 pl-6 font-semibold text-gray-600">
                Job & Company
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Date Applied
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-600 pr-6">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {allAppliedJobs.map((appliedJob) => {
              const job = appliedJob?.job;
              const status = appliedJob?.status?.toLowerCase();

              // Config màu sắc status
              const statusConfig = {
                accepted: {
                  className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
                  icon: <CheckCircle size={14} className="mr-1.5" />,
                  label: "Accepted"
                },
                rejected: {
                  className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
                  icon: <XCircle size={14} className="mr-1.5" />,
                  label: "Rejected"
                },
                pending: {
                  className: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
                  icon: <Clock size={14} className="mr-1.5" />,
                  label: "Pending"
                },
              };

              const currentStatus = statusConfig[status] || statusConfig.pending;

              return (
                <TableRow
                  key={appliedJob._id}
                  className="group hover:bg-purple-50/30 transition-all duration-200 border-b-gray-100 last:border-0 cursor-pointer"
                  onClick={() => navigate(`/description/${job?._id}`)}
                >
                  {/* 1. Job & Company */}
                  <TableCell className="py-5 pl-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl border border-gray-100 bg-white flex items-center justify-center p-1 shadow-sm group-hover:border-[#6A38C2]/30 transition-colors">
                        <Avatar className="h-full w-full rounded-lg">
                          <AvatarImage
                            src={job?.company?.logo}
                            className="object-contain"
                          />
                          <AvatarFallback className="rounded-lg bg-gray-50 text-[#6A38C2] font-bold text-lg">
                            {job?.company?.name?.charAt(0) || "C"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="font-bold text-base text-gray-900 group-hover:text-[#6A38C2] transition-colors flex items-center gap-2">
                          {job?.title || "Unknown Position"}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="font-medium text-gray-700 flex items-center gap-1">
                            <Building2 size={14} className="text-gray-400" />
                            {job?.company?.name}
                          </span>
                          {job?.location?.province && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <MapPin size={12} />
                                {job.location.province}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* 2. Date Applied */}
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <div className="p-1.5 rounded-md bg-gray-100 text-gray-500">
                         <CalendarDays size={14} />
                      </div>
                      {new Date(appliedJob?.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </TableCell>

                  {/* 3. Status Badge */}
                  <TableCell className="text-right pr-6">
                    <Badge
                      variant="outline"
                      className={`font-medium px-3 py-1.5 rounded-full capitalize border ${currentStatus.className}`}
                    >
                      {currentStatus.icon}
                      {status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AppliedJobTable;