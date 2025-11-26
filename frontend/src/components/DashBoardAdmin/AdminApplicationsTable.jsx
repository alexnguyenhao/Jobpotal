import React, { useState } from "react";
import useAdminApplications from "@/hooks/adminhooks/useAdminApplications";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Loader2,
  MoreHorizontal,
  Eye,
  FileText,
  Briefcase,
  Calendar,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const AdminApplicationsTable = () => {
  const { applications, loading } = useAdminApplications();
  const [filterText, setFilterText] = useState("");
  const navigate = useNavigate();
  const filteredApps = applications.filter((app) => {
    const searchKey = filterText.toLowerCase();
    const candidateName = app.applicant?.fullName?.toLowerCase() || "";
    const jobTitle = app.job?.title?.toLowerCase() || "";
    return candidateName.includes(searchKey) || jobTitle.includes(searchKey);
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "accepted")
      return "bg-green-100 text-green-700 hover:bg-green-200";
    if (s === "rejected") return "bg-red-100 text-red-700 hover:bg-red-200";
    return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"; // Pending
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[80vh]">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-sm text-gray-500">
            Monitor all job applications across the platform.
          </p>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search candidate or job..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A38C2]/20 w-full md:w-72 transition-all"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-[#6A38C2]" size={30} />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Candidate</th>
                <th className="p-4 font-semibold">Job Applied</th>
                <th className="p-4 font-semibold">Applied Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr
                    key={app._id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    {/* 1. Candidate Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-gray-200">
                          <AvatarImage src={app.applicant?.profilePhoto} />
                          <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">
                            {app.applicant?.fullName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {app.applicant?.fullName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {app.applicant?.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Job Info */}
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 flex items-center gap-1">
                          <Briefcase size={14} className="text-gray-400" />
                          {app.job?.title}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">
                          {app.job?.company?.name}
                        </span>
                      </div>
                    </td>

                    {/* 3. Date */}
                    <td className="p-4 text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} /> {formatDate(app.createdAt)}
                      </div>
                    </td>

                    {/* 4. Status */}
                    <td className="p-4">
                      <Badge
                        className={`px-2.5 py-0.5 rounded-md border-0 capitalize shadow-none ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </Badge>
                    </td>

                    {/* 5. Actions */}
                    <td className="p-4 text-right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-100"
                          >
                            <MoreHorizontal
                              size={18}
                              className="text-gray-500"
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2" align="end">
                          <div className="flex flex-col gap-1">
                            {/* Xem CV ứng viên */}
                            {app.applicant?.profile?.resume ? (
                              <a
                                href={app.applicant.profile.resume}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
                              >
                                <FileText size={16} /> View Resume
                              </a>
                            ) : (
                              // Nếu app lưu resume ở user root (tùy model của bạn)
                              <a
                                href={app.applicant?.resume}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
                              >
                                <FileText size={16} /> View Resume
                              </a>
                            )}

                            {/* Xem chi tiết User */}
                            <div
                              onClick={() =>
                                navigate(`/admin/users/${app.applicant?._id}`)
                              }
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
                            >
                              <Eye size={16} /> View Candidate
                            </div>

                            {/* Xem chi tiết Job */}
                            <div
                              onClick={() =>
                                navigate(`/admin/jobs/${app.job?._id}`)
                              }
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
                            >
                              <Briefcase size={16} /> View Job
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="bg-gray-100 p-3 rounded-full">
                        <FileText size={24} className="text-gray-400" />
                      </div>
                      <p>No applications found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminApplicationsTable;
