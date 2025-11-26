import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import {
  Edit2,
  MoreHorizontal,
  Search,
  Trash2,
  Eye,
  Building2,
  Ban,
  Verified,
} from "lucide-react";
import useAdminJob from "@/hooks/adminhooks/useAdminJob";

const AdminJobsTable = () => {
  const { jobs, isLoading, toggleJobStatus } = useAdminJob();
  const [filterText, setFilterText] = useState("");

  const navigate = useNavigate();
  const filteredJobs = jobs?.filter((job) => {
    if (!filterText) return true;
    const searchLower = filterText.toLowerCase();
    return (
      job?.title?.toLowerCase().includes(searchLower) ||
      job?.company?.name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Jobs Management</h2>
          <p className="text-sm text-gray-500">
            Total active jobs:{" "}
            <span className="font-medium text-gray-900">{jobs.length}</span>
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Filter by title or company..."
            className="pl-9"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[80px]">Logo</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Posted</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs?.length <= 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-gray-500"
                >
                  No jobs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs?.map((job) => (
                <TableRow
                  key={job._id}
                  className="hover:bg-gray-50/50 cursor-pointer"
                >
                  <TableCell>
                    <Avatar className="h-10 w-10 border border-gray-200 bg-white">
                      <AvatarImage
                        src={job.company?.logo}
                        className="object-contain p-1"
                      />
                      <AvatarFallback className="bg-gray-100 text-gray-400">
                        <Building2 size={20} />
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell className="font-medium text-gray-700">
                    <span
                      className="font-semibold text-gray-900 truncate"
                      onClick={() => navigate(`/admin/jobs/${job._id}`)}
                    >
                      {job.company?.name || "Unknown Company"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">
                        {job.title}
                      </span>
                      {/* Hiển thị thêm badge role/type nếu có */}
                      <div className="flex gap-1 mt-1">
                        {/* Ví dụ hiển thị JobType nếu data có */}
                        {job.jobType && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1 py-0 h-5 border-blue-200 text-blue-600 bg-blue-50"
                          >
                            {job.jobType}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  {job?.status === "Open" ? (
                    <TableCell>
                      <Badge className="bg-green-500 text-white hover:bg-green-500/80">
                        Open
                      </Badge>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <Badge className="bg-gray-500 text-white hover:bg-gray-500/80">
                        Closed
                      </Badge>
                    </TableCell>
                  )}
                  {/* Ngày tạo */}
                  <TableCell className="text-gray-500 text-sm">
                    {job?.createdAt ? job.createdAt.split("T")[0] : "N/A"}
                  </TableCell>

                  {/* Hành động */}
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-0" align="end">
                        <div className="flex flex-col text-sm">
                          {/* Xem Applicants */}
                          <div
                            className="flex items-center gap-2 cursor-pointer w-full p-2.5 hover:bg-gray-100 transition-colors"
                            onClick={() => toggleJobStatus(job._id)}
                          >
                            {job?.status === "Open" ? (
                              <Ban className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Verified className="w-4 h-4 text-gray-500" />
                            )}
                            <span>
                              {job?.status === "Open" ? "Close" : "Open"}
                            </span>
                          </div>

                          {/* Xóa Job */}
                          <div
                            className="flex items-center gap-2 cursor-pointer w-full p-2.5 hover:bg-red-50 text-red-600 transition-colors"
                            onClick={() => console.log("Delete job:", job._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Job</span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminJobsTable;
