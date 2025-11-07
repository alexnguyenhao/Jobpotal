import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.js";
import { Badge } from "@/components/ui/badge.js";
import { useSelector } from "react-redux";
import { Briefcase, Building2, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();

  if (!allAppliedJobs || allAppliedJobs.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10 text-sm italic">
        You haven’t applied for any jobs yet 🕊️
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-100 rounded-xl shadow-sm bg-white">
      <Table>
        <TableCaption className="text-sm text-gray-500 mt-2">
          A list of your recently applied jobs
        </TableCaption>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[120px] font-semibold text-gray-700">
              Date
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Job Title
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Location
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.map((appliedJob) => {
            const job = appliedJob?.job;
            const date = new Date(appliedJob?.createdAt).toLocaleDateString(
              "en-GB"
            );

            return (
              <TableRow
                key={appliedJob._id}
                className="hover:bg-gray-50 transition cursor-pointer"
                onClick={() => navigate(`/description/${job?._id}`)}
              >
                <TableCell className="text-sm text-gray-600">{date}</TableCell>
                <TableCell className="font-medium text-[#6A38C2] hover:underline flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#6A38C2]" />
                  {job?.title || "N/A"}
                </TableCell>
                <TableCell className="text-gray-600">
                  {job?.location?.province || "—"}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      appliedJob?.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : appliedJob?.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {appliedJob?.status?.toUpperCase()}
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
