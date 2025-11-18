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
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
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
  MoreHorizontal,
  Building2,
} from "lucide-react";

// Shared Components
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";

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

  if (loading || !singleJob) return <JobSkeleton />;

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
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* --- TOP BAR (Back & Actions) --- */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/jobs")}
            className="text-slate-600 hover:text-[#6A38C2]"
          >
            <ArrowLeft size={18} className="mr-2" /> Back to Jobs
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => navigate(`/admin/jobs/edit/${jobId}`)} // Giả sử route edit là create/:id hoặc edit/:id
            >
              <Edit size={16} className="mr-2" /> Edit Job
            </Button>
            <Button
              variant="destructive"
              className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 shadow-none"
              onClick={() => setOpenDelete(true)}
            >
              <Trash2 size={16} className="mr-2" /> Delete
            </Button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* 1. HERO HEADER & STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Title & Info */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-16 w-16 rounded-xl border bg-slate-50">
                <AvatarImage src={company?.logo} objectFit="contain" />
                <AvatarFallback className="rounded-xl">
                  <Building2 className="text-slate-400" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                  {isExpired ? (
                    <Badge
                      variant="destructive"
                      className="uppercase text-[10px]"
                    >
                      Closed
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 uppercase text-[10px]">
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                  {company?.name} <span className="text-slate-300">•</span>{" "}
                  {formatLocation(location)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <DetailBadge
                icon={<DollarSign size={14} />}
                label={formatSalary(salary)}
              />
              <DetailBadge icon={<Briefcase size={14} />} label={jobType} />
              <DetailBadge
                icon={<Clock size={14} />}
                label={`${experienceLevel} Exp`}
              />
            </div>
          </div>

          {/* Stats & Applicants CTA */}
          <Card className="bg-[#6A38C2] text-white border-none shadow-lg shadow-purple-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
              <div>
                <p className="text-purple-200 text-sm font-medium uppercase tracking-wide">
                  Total Applicants
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h2 className="text-5xl font-extrabold">{applicantCount}</h2>
                  <span className="text-sm text-purple-200">candidates</span>
                </div>
              </div>

              <Button
                className="w-full bg-white text-[#6A38C2] hover:bg-slate-100 font-bold mt-4"
                onClick={() => navigate(`/admin/jobs/${jobId}/applicants`)}
              >
                <Users size={18} className="mr-2" /> View Applicants
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 2. LEFT: DETAILS */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
                Job Description
              </h3>
              <div className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">
                {description}
              </div>
            </div>

            {/* Requirements */}
            {requirements?.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
                  Requirements
                </h3>
                <ul className="space-y-3">
                  {requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-slate-600 text-sm"
                    >
                      <div className="mt-1 min-w-[4px] h-[4px] rounded-full bg-[#6A38C2]" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {benefits?.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
                  Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {benefits.map((ben, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-slate-700 text-sm bg-slate-50 px-3 py-2 rounded-lg border border-slate-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      {ben}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. RIGHT: SIDEBAR INFO */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h4 className="font-bold text-slate-900">Job Overview</h4>

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
                isDestructive={isExpired}
              />
              <OverviewItem
                icon={Users}
                label="Seniority"
                value={seniorityLevel || "Not specified"}
              />
              <OverviewItem
                icon={Building2}
                label="Company"
                value={company?.name}
              />
            </div>

            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 text-center">
              <p className="text-[#6A38C2] font-medium text-sm">
                Need to update details?
              </p>
              <Button
                variant="link"
                className="text-[#6A38C2] font-bold"
                onClick={() => navigate(`/admin/jobs/edit/${jobId}`)}
              >
                Edit Job Posting
              </Button>
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

// --- SUB COMPONENTS ---
const DetailBadge = ({ icon, label }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700">
    <span className="text-[#6A38C2]">{icon}</span> {label}
  </span>
);

const OverviewItem = ({ icon: Icon, label, value, isDestructive }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-slate-500">
      <Icon size={16} />
      <span>{label}</span>
    </div>
    <span
      className={`font-medium ${
        isDestructive ? "text-red-600" : "text-slate-900"
      }`}
    >
      {value}
    </span>
  </div>
);

const JobSkeleton = () => (
  <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
    <div className="flex justify-between">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-32" />
    </div>
    <Skeleton className="h-40 w-full rounded-2xl" />
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2 space-y-4">
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
      <div className="col-span-1">
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  </div>
);

// --- HELPERS ---
const formatLocation = (loc) => {
  if (!loc) return "Remote";
  if (typeof loc === "string") return loc;
  return [loc.address, loc.district, loc.province].filter(Boolean).join(", ");
};

const formatSalary = (salary) => {
  if (!salary) return "Negotiable";
  if (typeof salary === "string") return salary;
  const { min, max, currency, isNegotiable } = salary;
  if (isNegotiable) return "Negotiable";
  const fmt = (n) => (n >= 1000000 ? `${n / 1000000}M` : `${n / 1000}K`);
  if (min && max) return `${fmt(min)} - ${fmt(max)} ${currency || "VND"}`;
  if (min) return `From ${fmt(min)} ${currency || "VND"}`;
  return "Negotiable";
};

export default JobDescriptionRecruiter;
