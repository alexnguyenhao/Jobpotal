import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAdminUserProfile from "@/hooks/adminhooks/useAdminUserProfile"; // Hook bạn đã tạo ở bước trước
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User as UserIcon,
  ShieldCheck,
  AlertCircle,
  FileText,
  Download,
  Clock,
  Briefcase,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Nếu bạn có shadcn badge, nếu không dùng thẻ span class
import { Loader2 } from "lucide-react";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Gọi Hook lấy dữ liệu
  const { user, loading } = useAdminUserProfile(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-[#6A38C2]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <h2 className="text-xl font-semibold text-gray-700">User not found</h2>
        <Button onClick={() => navigate("/admin/users")}>Go Back</Button>
      </div>
    );
  }

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 1. Header Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/users")}
          className="rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
      </div>

      {user.role === "student" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 2. LEFT COLUMN - OVERVIEW CARD */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-4">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={user.profilePhoto}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl bg-purple-100 text-purple-600">
                    {user.fullName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute bottom-2 right-2 w-5 h-5 border-2 border-white rounded-full ${
                    user.isEmailVerified ? "bg-green-500" : "bg-gray-300"
                  }`}
                  title={user.isEmailVerified ? "Verified" : "Unverified"}
                ></div>
              </div>

              {/* Name & Role */}
              <h2 className="text-xl font-bold text-gray-900">
                {user.fullName}
              </h2>
              <div className="mt-2 flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    user.role === "student"
                      ? "bg-blue-50 text-blue-700 border border-blue-100"
                      : "bg-purple-50 text-purple-700 border border-purple-100"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>

            {/* System Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-gray-500" /> System Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">User ID</span>
                  <span className="font-mono text-gray-700 text-xs">
                    {user._id}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Joined Date</span>
                  <span className="text-gray-700">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Last Login</span>
                  <span className="text-gray-700">
                    {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Email Verified</span>
                  <span
                    className={
                      user.isEmailVerified
                        ? "text-green-600 font-medium"
                        : "text-red-500"
                    }
                  >
                    {user.status ? "Active" : "Banned"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={
                      user.status
                        ? "text-green-600 font-medium"
                        : "text-red-500"
                    }
                  >
                    {user.status ? "Active" : "Banned"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">2FA Enabled</span>
                  <span
                    className={
                      user.is2FAEnabled
                        ? "text-green-600 font-medium"
                        : "text-gray-500"
                    }
                  >
                    {user.is2FAEnabled ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. RIGHT COLUMN - DETAILED INFO */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-[#6A38C2]" /> Personal
                Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-900 break-all">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-900">
                      {user.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(user.dateOfBirth)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <UserIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {user.gender || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">
                      {user.address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Profile & Bio */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#6A38C2]" /> Professional
                Info
              </h3>

              <div className="space-y-6">
                {/* Bio */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Bio
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-600 text-sm leading-relaxed">
                    {user.bio || "No biography provided."}
                  </div>
                </div>

                {/* Resume */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Resume / CV
                  </h4>
                  {user.resume ? (
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#6A38C2]/50 hover:bg-purple-50/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                          <FileText size={24} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 text-sm">
                            {user.resumeOriginalName || "Resume.pdf"}
                          </span>
                          <span className="text-xs text-gray-500">
                            PDF Document
                          </span>
                        </div>
                      </div>
                      <a
                        href={user.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download size={16} /> View
                        </Button>
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No resume uploaded.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Saved Jobs (Optional) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Activities
              </h3>
              <p className="text-sm text-gray-600">
                Saved Jobs:{" "}
                <span className="font-bold">{user.savedJobs?.length || 0}</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 2. LEFT COLUMN - OVERVIEW CARD */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-4">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={user.profilePhoto}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl bg-purple-100 text-purple-600">
                    {user.fullName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute bottom-2 right-2 w-5 h-5 border-2 border-white rounded-full ${
                    user.isEmailVerified ? "bg-green-500" : "bg-gray-300"
                  }`}
                  title={user.isEmailVerified ? "Verified" : "Unverified"}
                ></div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {user.fullName}
              </h2>
              <div className="mt-2 flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    user.role === "student"
                      ? "bg-blue-50 text-blue-700 border border-blue-100"
                      : "bg-purple-50 text-purple-700 border border-purple-100"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>

            {/* System Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-gray-500" /> System Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">User ID</span>
                  <span className="font-mono text-gray-700 text-xs">
                    {user._id}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Joined Date</span>
                  <span className="text-gray-700">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Last Login</span>
                  <span className="text-gray-700">
                    {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Email Verified</span>
                  <span
                    className={
                      user.isEmailVerified
                        ? "text-green-600 font-medium"
                        : "text-red-500"
                    }
                  >
                    {user.isEmailVerified ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">2FA Enabled</span>
                  <span
                    className={
                      user.is2FAEnabled
                        ? "text-green-600 font-medium"
                        : "text-gray-500"
                    }
                  >
                    {user.is2FAEnabled ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. RIGHT COLUMN - DETAILED INFO */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-[#6A38C2]" /> Personal
                Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-900 break-all">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-900">
                      {user.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(user.dateOfBirth)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <UserIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {user.gender || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">
                      {user.address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
