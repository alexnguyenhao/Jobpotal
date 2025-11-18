import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// UI Components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Icons
import { Building2, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();

  if (!allAppliedJobs || allAppliedJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
        <div className="bg-white p-4 rounded-full shadow-sm mb-3">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-gray-900 font-semibold text-lg">
          No Applications Yet
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          You haven't applied for any jobs yet. Start your search!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-sm bg-white border border-gray-200 overflow-hidden">
      <Table>
        <TableCaption className="pb-4 text-gray-500">
          A list of your recently applied jobs.
        </TableCaption>

        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-[350px] py-4 font-semibold text-gray-700">
              Job & Company
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Date Applied
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700 pr-6">
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
                color: "bg-green-100 text-green-700 hover:bg-green-200",
                icon: <CheckCircle size={14} />,
              },
              rejected: {
                color: "bg-red-100 text-red-700 hover:bg-red-200",
                icon: <XCircle size={14} />,
              },
              pending: {
                color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
                icon: <Clock size={14} />,
              },
            };

            const currentStatus = statusConfig[status] || statusConfig.pending;

            return (
              <TableRow
                key={appliedJob._id}
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => navigate(`/description/${job?._id}`)}
              >
                {/* 1. Job & Company */}
                <TableCell className="py-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 rounded-lg border bg-white">
                      <AvatarImage
                        src={job?.company?.logo}
                        objectFit="contain"
                      />
                      <AvatarFallback className="rounded-lg bg-gray-100 text-gray-500 font-bold">
                        {job?.company?.name?.charAt(0) || "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#6A38C2] transition-colors">
                        {job?.title || "Unknown Position"}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span className="font-medium text-gray-700">
                          {job?.company?.name}
                        </span>
                        {job?.location?.province && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <MapPin size={10} /> {job.location.province}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* 2. Date */}
                <TableCell className="text-sm text-gray-600">
                  {new Date(appliedJob?.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>

                {/* 3. Status */}
                <TableCell className="text-right pr-6">
                  <Badge
                    variant="secondary"
                    className={`font-medium px-2.5 py-1 rounded-md capitalize inline-flex items-center gap-1.5 ${currentStatus.color}`}
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
  );
};

export default AppliedJobTable;
