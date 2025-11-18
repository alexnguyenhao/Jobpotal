import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

// APIs & Actions
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import useSavedJobs from "@/hooks/useSavedJobs.jsx";
import useCV from "@/hooks/useCV";

// Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import ResumeSelectionDialog from "./appliedJob/ResumeSelectionDialog";

// Icons
import {
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Users,
  Globe,
  Mail,
  Phone,
  Building2,
  CalendarDays,
  CheckCircle2,
  Share2,
  Heart,
  HeartOff,
  ArrowLeft,
} from "lucide-react";

const JobDescription = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleJob, loading } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const { savedJobs, saveJob, unsaveJob } = useSavedJobs();
  const { cvs, fetchMyCVs } = useCV();

  const [isApplied, setIsApplied] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [openResumeDialog, setOpenResumeDialog] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    if (user) fetchMyCVs();

    const fetchJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          const job = res.data.job;
          dispatch(setSingleJob(job));

          setIsExpired(new Date(job.applicationDeadline) < new Date());
          setIsApplied(
            user
              ? job.applications?.some((a) => a.applicant === user?._id)
              : false
          );
          setIsSaved(
            user
              ? savedJobs?.some((j) => (j._id || j).toString() === jobId)
              : false
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchJob();
  }, [jobId, user, savedJobs, dispatch]); // Added dependencies

  // --- HANDLERS ---
  const handleApply = async (cvId) => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { cvId },
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsApplied(true);
        toast.success("🎉 Application submitted successfully!");
        setOpenResumeDialog(false);
        // Update local state
        const updatedJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedJob));
      }
    } catch (error) {
      if (error?.response?.status === 401) navigate("/login");
      toast.error(error?.response?.data?.message || "Application failed");
    }
  };

  const handleSaveToggle = () => {
    if (!user) return navigate("/login");
    if (isSaved) {
      unsaveJob(jobId);
      setIsSaved(false);
      toast.info("Removed from saved jobs");
    } else {
      saveJob(jobId);
      setIsSaved(true);
      toast.success("Job saved!");
    }
  };

  if (!singleJob) return <JobSkeleton />;

  const {
    title,
    description,
    requirements,
    benefits,
    company,
    location,
    salary,
    experienceLevel,
    seniorityLevel,
    jobType,
    applications,
    createdAt,
    applicationDeadline,
  } = singleJob;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* --- HEADER SECTION --- */}
      <div className="bg-slate-50 border-b border-slate-200 pt-10 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <Button
            variant="link"
            className="pl-0 mb-4 text-slate-500 hover:text-[#6A38C2]"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Jobs
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex gap-5">
              <Avatar className="h-20 w-20 rounded-xl border bg-white shadow-sm">
                <AvatarImage src={company?.logo} objectFit="object-contain" />
                <AvatarFallback className="rounded-xl bg-slate-100">
                  <Building2 size={32} className="text-slate-400" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {title}
                </h1>
                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-slate-600 font-medium">
                  <span
                    className="flex items-center gap-1 text-[#6A38C2] hover:underline cursor-pointer"
                    onClick={() => navigate(`/company/${company?._id}`)}
                  >
                    {company?.name}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {formatLocation(location)}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {daysAgo(createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full border-slate-300 ${
                  isSaved
                    ? "text-red-500 bg-red-50 border-red-200"
                    : "text-slate-600 hover:text-[#6A38C2]"
                }`}
                onClick={handleSaveToggle}
              >
                {isSaved ? (
                  <Heart fill="currentColor" size={20} />
                ) : (
                  <Heart size={20} />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-slate-300 text-slate-600 hover:text-[#6A38C2]"
              >
                <Share2 size={20} />
              </Button>
              <Button
                size="lg"
                className={`rounded-full px-8 font-bold shadow-lg shadow-purple-200 ${
                  isApplied || isExpired
                    ? "bg-slate-300 cursor-not-allowed text-slate-500"
                    : "bg-[#6A38C2] hover:bg-[#582bb6] text-white"
                }`}
                disabled={isApplied || isExpired}
                onClick={() =>
                  !isApplied &&
                  !isExpired &&
                  (user ? setOpenResumeDialog(true) : navigate("/login"))
                }
              >
                {isApplied ? "Applied" : isExpired ? "Expired" : "Apply Now"}
              </Button>
            </div>
          </div>

          {/* Key Stats Tags */}
          <div className="flex flex-wrap gap-3 mt-8">
            <StatBadge
              icon={<DollarSign size={14} />}
              label={formatSalary(salary)}
            />
            <StatBadge
              icon={<Briefcase size={14} />}
              label={jobType || "Full-time"}
            />
            <StatBadge
              icon={<Users size={14} />}
              label={`${seniorityLevel || "Any"} Level`}
            />
            <StatBadge
              icon={<Clock size={14} />}
              label={`${experienceLevel || "0"} Yrs Exp`}
            />
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT: DESCRIPTION */}
        <div className="lg:col-span-2 space-y-10">
          {/* Description */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Job Description
            </h3>
            <div className="text-slate-600 leading-relaxed whitespace-pre-line text-base">
              {description}
            </div>
          </section>

          {/* Requirements */}
          {requirements?.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Requirements
              </h3>
              <ul className="space-y-3">
                {requirements.map((req, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-slate-600"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#6A38C2] shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Benefits */}
          {benefits?.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Benefits
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {benefits.map((ben, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {ben}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* RIGHT: SIDEBAR INFO */}
        <div className="space-y-6">
          {/* Job Overview Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-5">Job Overview</h4>
            <div className="space-y-4">
              <SidebarItem
                icon={<CalendarDays />}
                label="Posted date"
                value={new Date(createdAt).toLocaleDateString("en-GB")}
              />
              <SidebarItem
                icon={<Clock />}
                label="Deadline"
                value={new Date(applicationDeadline).toLocaleDateString(
                  "en-GB"
                )}
                highlight={isExpired}
              />
              <SidebarItem
                icon={<Users />}
                label="Applicants"
                value={`${applications?.length || 0} people`}
              />
            </div>
          </div>

          {/* Company Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-12 w-12 rounded-lg bg-white border">
                <AvatarImage src={company?.logo} />
                <AvatarFallback>
                  <Building2 />
                </AvatarFallback>
              </Avatar>
              <div>
                <h4
                  className="font-bold text-slate-900 hover:text-[#6A38C2] cursor-pointer"
                  onClick={() => navigate(`/company/${company?._id}`)}
                >
                  {company?.name}
                </h4>
                <p className="text-xs text-slate-500">Software & Technology</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {company?.website && (
                <a
                  href={company.website}
                  target="_blank"
                  className="flex items-center gap-2 text-slate-600 hover:text-[#6A38C2]"
                >
                  <Globe size={16} /> Website
                </a>
              )}
              {company?.email && (
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-2 text-slate-600 hover:text-[#6A38C2]"
                >
                  <Mail size={16} /> Email
                </a>
              )}
              {company?.location && (
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin size={16} /> {company.location}
                </div>
              )}
            </div>

            <Button
              variant="outline"
              className="w-full mt-6 bg-white hover:bg-slate-100"
              onClick={() => navigate(`/company/${company?._id}`)}
            >
              View Company Profile
            </Button>
          </div>
        </div>
      </div>

      <ResumeSelectionDialog
        open={openResumeDialog}
        setOpen={setOpenResumeDialog}
        resumes={cvs}
        onSelectResume={handleApply}
        onSelectProfile={() => handleApply(null)}
      />
    </div>
  );
};

// --- SUB COMPONENTS ---
const StatBadge = ({ icon, label }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-700 shadow-sm">
    <span className="text-[#6A38C2]">{icon}</span> {label}
  </span>
);

const SidebarItem = ({ icon, label, value, highlight }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-slate-400">{icon}</div>
    <div>
      <p className="text-xs text-slate-500 uppercase font-semibold">{label}</p>
      <p
        className={`text-sm font-medium ${
          highlight ? "text-red-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

const JobSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
    <div className="flex gap-4">
      <Skeleton className="h-20 w-20 rounded-xl" />
      <div className="space-y-3 w-full">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-10">
      <div className="col-span-2 space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
      <div className="col-span-1 space-y-4">
        <Skeleton className="h-60 w-full" />
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

const daysAgo = (date) => {
  const diff = Math.floor(
    (new Date() - new Date(date)) / (1000 * 60 * 60 * 24)
  );
  return diff === 0 ? "Today" : `${diff}d ago`;
};

export default JobDescription;
