import React from "react";
import { Link } from "react-router-dom";
import useUpdateApplication from "@/hooks/useUpdateApplication.jsx";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// 👇 1. Import thêm Dialog để xem Cover Letter
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"; // (Tuỳ chọn) cho text dài

// Icons
import {
  MoreHorizontal,
  Check,
  X,
  FileText,
  User,
  Calendar,
  Mail,
  Phone,
  MessageSquare, // 👇 2. Import icon Message
} from "lucide-react";

const ApplicantsTable = () => {
  const { applicants, statusHandler } = useUpdateApplication();

  if (!applicants?.applications?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-200 text-center">
        <div className="bg-gray-50 p-4 rounded-full mb-3">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">
          No applicants found for this job yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-sm bg-white border border-gray-200 overflow-hidden">
      <Table>
        <TableCaption className="pb-4">
          A list of your recent applicants.
        </TableCaption>

        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-[250px] py-4 font-semibold text-gray-700">
              Candidate
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Contact
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Resume / CV
            </TableHead>
            {/* 👇 3. Thêm cột Cover Letter */}
            <TableHead className="font-semibold text-gray-700">
              Cover Letter
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Date Applied
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Status
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700 pr-6">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {applicants.applications.map((item) => (
            <TableRow
              key={item._id}
              className="hover:bg-slate-50 transition-colors group"
            >
              {/* 1. CANDIDATE */}
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border bg-white">
                    <AvatarImage src={item?.applicant?.profilePhoto} />
                    <AvatarFallback className="bg-purple-50 text-[#6A38C2] font-bold">
                      {item?.applicant?.fullName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      to={`/recruiter/applicants/resume/${item?.applicant?._id}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 transition-colors block"
                    >
                      {item?.applicant?.fullName || "Unknown"}
                    </Link>
                    <span className="text-xs text-gray-500">
                      ID: {item._id.slice(-6)}
                    </span>
                  </div>
                </div>
              </TableCell>

              {/* 2. CONTACT */}
              <TableCell>
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    <span
                      className="truncate max-w-[150px]"
                      title={item?.applicant?.email}
                    >
                      {item?.applicant?.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    <span>{item?.applicant?.phoneNumber || "N/A"}</span>
                  </div>
                </div>
              </TableCell>

              {/* 3. RESUME */}
              <TableCell>
                {item.cv ? (
                  <Link
                    to={`/cv/view/${item.cv._id}`}
                    className="inline-flex items-center gap-2 text-[#6A38C2] hover:text-[#5a2ea6] hover:underline font-medium text-sm"
                  >
                    <FileText size={16} /> View Online CV
                  </Link>
                ) : item?.applicant?.resume ? (
                  <a
                    href={item?.applicant?.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm"
                  >
                    <FileText size={16} />
                    <span className="truncate max-w-[120px]">
                      {item.applicant.resumeOriginalName || "Download"}
                    </span>
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm italic">No CV</span>
                )}
              </TableCell>

              {/* 👇 4. COVER LETTER COLUMN (MỚI) */}
              <TableCell>
                {item.coverLetter ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-2 text-gray-600 hover:text-[#6A38C2] hover:bg-purple-50"
                      >
                        <MessageSquare size={16} />
                        <span className="text-xs font-medium">Read</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-[#6A38C2]" />
                          Cover Letter
                        </DialogTitle>
                        <div className="text-sm text-gray-500">
                          From:{" "}
                          <span className="font-medium text-gray-900">
                            {item?.applicant?.fullName}
                          </span>
                        </div>
                      </DialogHeader>
                      <div className="bg-gray-50 p-4 rounded-lg mt-2 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                        {item.coverLetter}
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <span className="text-gray-400 text-xs italic pl-3">N/A</span>
                )}
              </TableCell>

              {/* 5. DATE */}
              <TableCell className="text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  {new Date(item.createdAt).toLocaleDateString("en-GB")}
                </div>
              </TableCell>

              {/* 6. STATUS */}
              <TableCell>
                <Badge
                  variant="secondary"
                  className={`font-normal px-2.5 py-0.5 ${
                    item.status === "accepted"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : item.status === "rejected"
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  }`}
                >
                  {item.status
                    ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                    : "Pending"}
                </Badge>
              </TableCell>

              {/* 7. ACTIONS */}
              <TableCell className="text-right pr-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-black"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-1" align="end">
                    <div className="space-y-0.5">
                      {["Accepted", "Rejected"].map((status) => (
                        <div
                          key={status}
                          onClick={() => statusHandler(status, item?._id)}
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                        >
                          {status === "Accepted" ? (
                            <Check size={16} className="text-green-600" />
                          ) : (
                            <X size={16} className="text-red-600" />
                          )}
                          <span
                            className={
                              status === "Accepted"
                                ? "text-green-700 font-medium"
                                : "text-red-700 font-medium"
                            }
                          >
                            {status}
                          </span>
                        </div>
                      ))}
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

export default ApplicantsTable;
