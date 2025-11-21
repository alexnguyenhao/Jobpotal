import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

// Constants & Redux
import { JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

// Icons
import {
  ArrowLeft,
  Users,
  Edit,
  Trash2,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  CalendarDays,
  CheckCircle2,
  Building2,
  Loader2,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";

// Shared Components
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";

// --- HELPER COMPONENTS ---
const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-3 mt-8 first:mt-0">
    <div className="p-2 bg-purple-50 rounded-lg text-[#6A38C2]">
      <Icon size={18} strokeWidth={2.5} />
    </div>
    <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider">
      {title}
    </h2>
  </div>
);

const OverviewItem = ({ icon: Icon, label, value, subValue }) => (
  <div className="flex items-start justify-between text-sm py-2 border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-2 text-gray-500">
      <Icon size={16} />
      <span>{label}</span>
    </div>
    <div className="text-right">
      <span className="font-medium text-gray-900 block">{value}</span>
      {subValue && <span className="text-xs text-gray-400">{subValue}</span>}
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const JobDescriptionRecruiter = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleJob } = useSelector((store) => store.job);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId, dispatch]);

  // --- DELETE HANDLER ---
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Job deleted successfully");
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500 bg-gray-50/50">
        <Loader2 className="h-10 w-10 animate-spin text-[#6A38C2]" />
        <p className="font-medium text-sm">Loading Job Details...</p>
      </div>
    );
  }

  if (!singleJob) return null;

  const {
    title,
    description,
    requirements,
    benefits,
    location,
    salary,
    experienceLevel,
    seniorityLevel,
    jobType,
    applications,
    createdAt,
    applicationDeadline,
    company,
  } = singleJob;

  const applicantCount = applications?.length || 0;
  const isExpired = new Date(applicationDeadline) < new Date();

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* --- STICKY HEADER --- */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100"
            onClick={() => navigate("/admin/jobs")}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Job Details
              {isExpired ? (
                <Badge
                  variant="destructive"
                  className="text-[10px] px-2 py-0.5 h-5"
                >
                  Closed
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 text-[10px] px-2 py-0.5 h-5 shadow-none">
                  Active
                </Badge>
              )}
            </h1>
            <p className="text-xs text-gray-500">
              Manage and review your job posting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="hidden sm:flex"
            onClick={() => navigate(`/admin/jobs/edit/${jobId}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Job
          </Button>
          <Button
            variant="destructive"
            onClick={() => setOpenDelete(true)}
            className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 shadow-none"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-5xl mx-auto mt-8 px-4 md:px-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[800px]">
          {/* 1. HERO SECTION (Dark) */}
          <div className="bg-slate-900 text-white p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex items-start gap-5">
                <Avatar className="h-20 w-20 rounded-xl border-2 border-white/20 bg-white">
                  <AvatarImage
                    src={company?.logo}
                    className="object-contain p-1"
                  />
                  <AvatarFallback className="rounded-xl bg-white text-slate-900 font-bold text-2xl">
                    {company?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-purple-200 text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <Building2 size={16} /> {company?.name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} /> {formatLocation(location)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats on Hero */}
              <div className="flex gap-3 self-start md:self-center">
                <div className="px-4 py-2 bg-white/10 rounded-lg border border-white/10 text-center backdrop-blur-sm">
                  <p className="text-xs text-gray-300 uppercase">Salary</p>
                  <p className="font-bold text-sm md:text-base">
                    {formatSalary(salary)}
                  </p>
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-lg border border-white/10 text-center backdrop-blur-sm">
                  <p className="text-xs text-gray-300 uppercase">Type</p>
                  <p className="font-bold text-sm md:text-base">
                    {Array.isArray(jobType) ? jobType[0] : jobType}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. BODY CONTENT */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* LEFT COLUMN (Content) */}
              <div className="lg:col-span-8 space-y-10">
                {/* Description */}
                {/* --- Description (Thêm whitespace-pre-wrap) --- */}
                <section>
                  <SectionHeader title="Job Description" icon={Briefcase} />
                  <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap text-justify">
                    {description}
                  </div>
                </section>

                {/* --- Requirements (Sử dụng hàm parseStringToArray) --- */}
                <section>
                  <SectionHeader title="Requirements" icon={CheckCircle2} />
                  <ul className="space-y-3">
                    {parseStringToArray(requirements).map((req, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-gray-700"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6A38C2] shrink-0"></span>
                        {/* Xóa ký tự gạch đầu dòng nếu người dùng tự nhập */}
                        <span className="leading-relaxed">
                          {req.replace(/^- /, "")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* --- Benefits (Sử dụng hàm parseStringToArray) --- */}
                <section>
                  <SectionHeader title="Benefits" icon={DollarSign} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {parseStringToArray(benefits).map((ben, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-700"
                      >
                        <CheckCircle2
                          size={16}
                          className="text-green-600 shrink-0"
                        />
                        {/* Xóa ký tự gạch đầu dòng nếu có */}
                        {ben.replace(/^- /, "")}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN (Sidebar) */}
              <div className="lg:col-span-4 space-y-8">
                {/* Applicant Card - Highlighted */}
                <Card className="bg-[#6A38C2] border-none shadow-lg shadow-purple-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-purple-100 text-xs font-bold uppercase tracking-wider">
                          Total Applications
                        </p>
                        <h2 className="text-4xl font-extrabold text-white mt-1">
                          {applicantCount}
                        </h2>
                      </div>
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Users className="text-white" size={20} />
                      </div>
                    </div>
                    <Button
                      onClick={() =>
                        navigate(`/admin/jobs/${jobId}/applicants`)
                      }
                      className="w-full bg-white text-[#6A38C2] hover:bg-gray-50 font-bold border-none"
                    >
                      View All Candidates
                    </Button>
                  </CardContent>
                </Card>

                {/* Job Overview */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle size={16} className="text-[#6A38C2]" />
                    Overview
                  </h4>
                  <div className="space-y-2">
                    <OverviewItem
                      icon={CalendarDays}
                      label="Posted Date"
                      value={new Date(createdAt).toLocaleDateString("en-GB")}
                    />
                    <OverviewItem
                      icon={Clock}
                      label="Deadline"
                      value={new Date(applicationDeadline).toLocaleDateString(
                        "en-GB"
                      )}
                      subValue={isExpired ? "Expired" : "Active"}
                    />
                    <OverviewItem
                      icon={Briefcase}
                      label="Experience"
                      value={`${experienceLevel} Years`}
                    />
                    <OverviewItem
                      icon={Users}
                      label="Level"
                      value={seniorityLevel}
                    />
                  </div>
                </div>

                {/* Helper Actions */}
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-2">
                    Need to make changes?
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={() => navigate(`/admin/jobs/edit/${jobId}`)}
                  >
                    Update Job Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        title="Delete Job Posting"
        message="Are you sure? This action will permanently delete the job and all associated applications."
      />
    </div>
  );
};

// --- HELPERS ---
const formatLocation = (loc) => {
  if (!loc) return "Remote";
  if (typeof loc === "string") return loc;
  // Giả sử loc là object { province, district, address }
  return loc.province || loc.address || "Unknown Location";
};

const formatSalary = (salary) => {
  if (!salary) return "Negotiable";
  if (typeof salary === "string") return salary;
  const { min, max, currency, isNegotiable } = salary;
  if (isNegotiable) return "Negotiable";

  const fmt = (n) => (n >= 1000000 ? `${n / 1000000}M` : `${n / 1000}K`);

  if (min && max) return `${fmt(min)} - ${fmt(max)} ${currency || "VND"}`;
  if (min) return `From ${fmt(min)} ${currency || "VND"}`;
  if (max) return `Up to ${fmt(max)} ${currency || "VND"}`;
  return "Negotiable";
};
const parseStringToArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data; // Nếu đã là mảng thì trả về luôn
  return data.split("\n").filter((item) => item.trim() !== "");
};
export default JobDescriptionRecruiter;
