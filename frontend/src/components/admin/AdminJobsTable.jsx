import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit2, Eye, MoreHorizontal, Building2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState([]);
  const navigate = useNavigate();

  // 🔍 Lọc theo từ khóa (job title hoặc company name)
  useEffect(() => {
    const filtered =
      allAdminJobs?.filter((job) => {
        if (!searchJobByText) return true;
        const text = searchJobByText.toLowerCase();
        return (
          job?.title?.toLowerCase().includes(text) ||
          job?.company?.name?.toLowerCase().includes(text)
        );
      }) || [];
    setFilterJobs(filtered);
  }, [allAdminJobs, searchJobByText]);

  // 🚫 Trạng thái rỗng
  if (!filterJobs.length) {
    return (
      <div className="text-center py-12 text-gray-500 font-medium border border-dashed border-gray-200 rounded-xl bg-white shadow-sm">
        No jobs found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-md bg-white border border-gray-100">
      <Table className="w-full text-sm">
        <TableCaption className="text-gray-500 text-sm py-3">
          A list of your recently posted jobs
        </TableCaption>

        {/* ===== Header ===== */}
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold text-gray-700 py-4 w-[35%]">
              Company
            </TableHead>
            <TableHead className="font-semibold text-gray-700 py-4 w-[35%]">
              Job Title
            </TableHead>
            <TableHead className="font-semibold text-gray-700 py-4 w-[20%]">
              Created Date
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700 py-4 pr-6 w-[10%]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* ===== Body ===== */}
        <TableBody>
          {filterJobs.map((job) => (
            <TableRow
              key={job._id}
              className="hover:bg-gray-50 transition-all duration-200"
            >
              {/* Company Name */}
              <TableCell className="py-4 text-gray-800 font-medium">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="truncate">
                    {job?.company?.name || "N/A"}
                  </span>
                </div>
              </TableCell>

              {/* Job Title */}
              <TableCell className="py-4 text-gray-700">
                <span
                  onClick={() => job._id && navigate(`/description/${job._id}`)}
                  className="cursor-pointer hover:text-[#6A38C2] transition-colors"
                >
                  {job?.title || "N/A"}
                </span>
              </TableCell>

              {/* Created Date */}
              <TableCell className="py-4 text-gray-600 text-sm">
                {job?.createdAt
                  ? new Date(job.createdAt).toLocaleDateString("en-GB")
                  : "N/A"}
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right py-4 pr-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="p-1 rounded-md hover:bg-gray-100 transition">
                      <MoreHorizontal className="h-5 w-5 text-gray-500 hover:text-gray-800" />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent
                    side="left"
                    align="end"
                    className="w-44 bg-white shadow-lg rounded-md border border-gray-200 p-2"
                  >
                    <div
                      onClick={() =>
                        job._id && navigate(`/admin/jobs/${job._id}`)
                      }
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                      <span>Edit</span>
                    </div>

                    <div
                      onClick={() =>
                        job._id && navigate(`/admin/jobs/${job._id}/applicants`)
                      }
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition"
                    >
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span>Applicants</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
