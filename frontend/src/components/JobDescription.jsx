import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import useSavedJobs from "@/hooks/useSavedJobs.jsx";
import useCV from "@/hooks/useCV";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ResumeSelectionDialog from "./appliedJob/ResumeSelectionDialog";

import {
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Users,
  Globe,
  Mail,
  Building2,
  CalendarDays,
  CheckCircle2,
  Share2,
  Heart,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

const StatBadge = ({ icon, label }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-700 shadow-sm">
    <span className="text-[#6A38C2]">{icon}</span> {label}
  </span>
);

const SidebarItem = ({ icon, label, value, highlight }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
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

const JobDescription = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleJob } = useSelector((s) => s.job);
  const { user } = useSelector((s) => s.auth);
  const { savedJobs, saveJob, unsaveJob } = useSavedJobs();
  const { cvs, fetchMyCVs } = useCV();

  const [isApplied, setIsApplied] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openResumeDialog, setOpenResumeDialog] = useState(false);

  const hasFetchedCVs = useRef(false);

  // ⚡ 1. Fetch CVs — ONLY ONE TIME
  useEffect(() => {
    if (user && !hasFetchedCVs.current) {
      hasFetchedCVs.current = true;
      fetchMyCVs();
    }
  }, [user]);

  // ⚡ 2. Fetch Job by ID
  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          const job = res.data.job;
          dispatch(setSingleJob(job));

          setIsExpired(new Date(job.applicationDeadline) < new Date());

          if (user) {
            setIsApplied(
              job.applications?.some((a) => a.applicant === user._id)
            );
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, user, dispatch]);

  // ⚡ 3. Sync saved state — runs only when savedJobs changes
  useEffect(() => {
    if (!user) return;
    setIsSaved(savedJobs?.some((j) => (j._id || j).toString() === jobId));
  }, [savedJobs, jobId, user]);

  // APPLY HANDLER
  const handleApply = async (cvId) => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { cvId },
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        toast.success("🎉 Application submitted!");
        setOpenResumeDialog(false);

        dispatch(
          setSingleJob({
            ...singleJob,
            applications: [...singleJob.applications, { applicant: user?._id }],
          })
        );
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
      toast.info("Removed from saved jobs");
    } else {
      saveJob(jobId);
      toast.success("Job saved!");
    }
  };

  if (loading) return <JobSkeleton />;
  if (!singleJob) return null;

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
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border bg-white hidden sm:block">
              <AvatarImage src={company?.logo} className="object-contain" />
              <AvatarFallback>
                <Building2 size={18} />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-sm font-bold text-gray-900 line-clamp-1">
                {title}
              </h1>
              <p className="text-xs text-gray-500 line-clamp-1">
                at{" "}
                <span className="font-medium text-gray-700">
                  {company?.name}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleSaveToggle}>
            <Heart
              size={20}
              fill={isSaved ? "currentColor" : "none"}
              className={isSaved ? "text-red-500" : ""}
            />
          </Button>

          <Button
            className={`rounded-full px-6 font-bold shadow-sm ${
              isApplied || isExpired
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-[#6A38C2] text-white"
            }`}
            disabled={isApplied || isExpired}
            onClick={() =>
              !isApplied &&
              !isExpired &&
              (user ? setOpenResumeDialog(true) : navigate("/login"))
            }
          >
            {isApplied ? "Applied" : isExpired ? "Closed" : "Apply Now"}
          </Button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT SIDE */}
        <div className="lg:col-span-8 space-y-10">
          <section>
            <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 mb-4">
              <div className="w-1 h-6 bg-[#6A38C2] rounded-full"></div>
              Job Description
            </h3>
            <div className="text-gray-600 leading-7 whitespace-pre-line text-sm md:text-base">
              {description}
            </div>
          </section>

          {requirements?.length > 0 && (
            <section>
              <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 mb-4">
                <div className="w-1 h-6 bg-[#6A38C2] rounded-full"></div>
                Requirements
              </h3>
              <ul className="space-y-3">
                {requirements.map((req, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-gray-700 text-sm md:text-base bg-white p-3 rounded-lg border border-gray-100"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#6A38C2] shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {benefits?.length > 0 && (
            <section>
              <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 mb-4">
                <div className="w-1 h-6 bg-[#6A38C2] rounded-full"></div>
                Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {benefits.map((ben, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-800 rounded-lg border border-green-100 text-sm font-medium"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                    {ben}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h4 className="font-bold flex items-center gap-2 text-gray-900 mb-4">
                <AlertCircle size={18} className="text-[#6A38C2]" /> Job
                Overview
              </h4>

              <SidebarItem
                icon={<CalendarDays size={16} />}
                label="Posted Date"
                value={new Date(createdAt).toLocaleDateString("en-GB")}
              />
              <SidebarItem
                icon={<Clock size={16} />}
                label="Deadline"
                value={new Date(applicationDeadline).toLocaleDateString(
                  "en-GB"
                )}
                highlight={isExpired}
              />
              <SidebarItem
                icon={<Users size={16} />}
                label="Seniority Level"
                value={seniorityLevel || "Not specified"}
              />
              <SidebarItem
                icon={<Briefcase size={16} />}
                label="Openings"
                value={`${singleJob.position || 1} positions`}
              />

              <Separator className="my-4" />

              <p className="text-xs text-center text-gray-400">
                {applications?.length || 0} people have applied
              </p>
            </CardContent>
          </Card>

          {/* Company */}
          <Card className="border-gray-200 shadow-sm bg-slate-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12 border bg-white">
                  <AvatarImage src={company?.logo} />
                  <AvatarFallback>
                    <Building2 />
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h4 className="font-bold text-gray-900 line-clamp-1">
                    {company?.name}
                  </h4>
                  <a
                    href={company?.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#6A38C2] hover:underline flex items-center gap-1"
                  >
                    <Globe size={10} /> Visit Website
                  </a>
                </div>
              </div>

              {company?.email && (
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                  <Mail size={12} /> {company.email}
                </div>
              )}
              {company?.location && (
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
                  <MapPin size={12} /> {company.location}
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/company/${company?._id}`)}
              >
                View Company Profile
              </Button>
            </CardContent>
          </Card>
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

const JobSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
    <div className="flex gap-6">
      <Skeleton className="h-24 w-24 rounded-2xl" />
      <div className="space-y-3 w-full max-w-lg">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-10">
      <div className="col-span-2 space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
      <div className="col-span-1">
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  </div>
);
const parseStringToArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data; // Nếu đã là mảng thì trả về luôn
  return data.split("\n").filter((item) => item.trim() !== "");
};
export default JobDescription;
