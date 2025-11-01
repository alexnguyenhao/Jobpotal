import React from "react";
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
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const shortListingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const navigate = useNavigate();
  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      );
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  // Empty state khi không có ứng viên
  if (!applicants?.applications?.length) {
    return (
      <div className="text-center py-10 text-gray-500 font-medium">
        No applicants available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
      <Table>
        <TableCaption className="text-gray-500 text-sm mb-4">
          A list of your recent applicants
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-700 py-4">
              Full Name
            </TableHead>
            <TableHead className="font-semibold text-gray-700 py-4">
              Email
            </TableHead>
            <TableHead className="font-semibold text-gray-700 py-4">
              Contact
            </TableHead>
            <TableHead className="font-semibold text-gray-700 py-4">
              Resume
            </TableHead>
            <TableHead className="font-semibold text-gray-700 py-4">
              Date
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700 py-4">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.applications.map((item) => (
            <TableRow
              key={item._id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <TableCell className="text-gray-800 py-3">
                {item?.applicant?.fullName || "N/A"}
              </TableCell>
              <TableCell className="text-gray-800 py-3">
                {item?.applicant?.email || "N/A"}
              </TableCell>
              <TableCell className="text-gray-800 py-3">
                {item?.applicant?.phoneNumber || "N/A"}
              </TableCell>
              <TableCell className="py-3">
                {item?.applicant?.resume ? (
                  <a
                    href={item.applicant.resume}
                    className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.applicant.resumeOriginalName || "View Resume"}
                  </a>
                ) : (
                  <span className="text-gray-400">No Resume</span>
                )}
              </TableCell>
              <TableCell className="text-gray-800 py-3">28-10-2025</TableCell>
              <TableCell className="text-right py-3">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal className="h-5 w-5 text-gray-500 hover:text-gray-800 cursor-pointer transition-colors" />
                  </PopoverTrigger>
                  <PopoverContent className="w-40 bg-white shadow-lg rounded-md border border-gray-200 p-2">
                    {shortListingStatus.map((status) => (
                      <div
                        onClick={() => statusHandler(status, item?._id)}
                        key={status}
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm cursor-pointer transition-colors duration-150"
                      >
                        <span>{status}</span>
                      </div>
                    ))}
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

export default ApplicantsTable;
