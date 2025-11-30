import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import { JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import useSavedJobs from "@/hooks/useSavedJobs.jsx";
import useCV from "@/hooks/useCV";
import useApplyJob from "@/hooks/useApplyJob";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ResumeSelectionDialog from "./appliedJob/ResumeSelectionDialog";
import { formatLocation } from "@/utils/formatLocation";
import { formatSalary } from "@/utils/formatSalary";
import {
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Users,
  Globe,
  Building2,
  CheckCircle2,
  Heart,
  Share2,
  Flag,
  MonitorPlay,
  Hourglass,
} from "lucide-react";
const InfoBox = ({ icon, label, value, className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="p-2.5 rounded-full bg-white/10 shrink-0 text-white md:bg-purple-50 md:text-[#6A38C2]">
      {icon}
    </div>
    <div>
      <p className="text-xs text-white/70 md:text-gray-500 font-medium mb-0.5">
        {label}
      </p>
      <p className="font-bold text-white md:text-gray-900 text-sm md:text-base line-clamp-1">
        {value}
      </p>
    </div>
  </div>
);

const GeneralInfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-gray-400 shrink-0">{icon}</div>
    <div>
      <p className="text-sm font-semibold text-gray-900">{label}</p>
      <p className="text-sm text-gray-600 mt-0.5 font-medium">{value}</p>
    </div>
  </div>
);

const SectionTitle = ({ title }) => (
  <h3 className="text-xl font-bold text-gray-900 mb-4 pl-3 border-l-4 border-[#6A38C2]">
    {title}
  </h3>
);

// --- Main Component ---
const JobDescription = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux & Hooks
  const { singleJob } = useSelector((s) => s.job);
  const { user } = useSelector((s) => s.auth);
  const { savedJobs, saveJob, unsaveJob } = useSavedJobs();
  const { cvs, fetchMyCVs } = useCV();
  const { applyJob, isApplying } = useApplyJob();

  // Local State
  // Thay đổi: Dùng count thay vì boolean isApplied
  const [applicationCount, setApplicationCount] = useState(0);
  const MAX_APPLY_LIMIT = 3;

  const [isExpired, setIsExpired] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openResumeDialog, setOpenResumeDialog] = useState(false);

  const hasFetchedCVs = useRef(false);

  // Fetch CVs khi có user
  useEffect(() => {
    if (user && !hasFetchedCVs.current) {
      hasFetchedCVs.current = true;
      fetchMyCVs();
    }
  }, [user]);

  // Fetch Job Details & Check Application Status
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
            // Logic MỚI: Đếm số lần user này đã nộp đơn vào job này
            const myApplications = job.applications?.filter(
              (a) => a.applicant === user._id
            );
            setApplicationCount(myApplications?.length || 0);
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

  // Check Saved Status
  useEffect(() => {
    if (!user) return;
    setIsSaved(savedJobs?.some((j) => (j._id || j).toString() === jobId));
  }, [savedJobs, jobId, user]);

  // Handle Apply Logic
  const handleApplyWrapper = async (cvId, coverLetter) => {
    // Gọi hook applyJob
    const success = await applyJob(jobId, cvId, coverLetter, singleJob, user);

    if (success) {
      // Nếu thành công, tăng biến đếm lên 1 để cập nhật UI ngay lập tức
      setApplicationCount((prev) => prev + 1);
      setOpenResumeDialog(false);
      toast.success(
        `Application sent! (${applicationCount + 1}/${MAX_APPLY_LIMIT})`
      );
    }
  };

  // Handle Save/Unsave Logic
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

  if (loading) return <JobSkeletonTopCVStyle />;
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
    numberOfPositions,
    applicationDeadline,
  } = singleJob;

  const daysLeft = Math.ceil(
    (new Date(applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      {/* Header Section */}
      <div className="bg-white shadow-sm pt-8 pb-8 md:pt-10 md:pb-12 px-4 md:px-0 mb-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-white border border-gray-100 shadow-md rounded-xl p-2 flex items-center justify-center overflow-hidden">
              <Avatar className="h-full w-full rounded-none">
                <AvatarImage
                  src={singleJob.company?.logo}
                  className="object-contain"
                />
                <AvatarFallback className="rounded-none bg-transparent">
                  <Building2 className="w-12 h-12 text-gray-300" />
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Title & Actions */}
            <div className="flex-1 w-full">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3">
                {title}
              </h1>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 mb-6">
                <span
                  className="font-semibold text-gray-600 hover:text-[#6A38C2] transition-colors cursor-pointer text-lg"
                  onClick={() => navigate(`/company/${singleJob.company?._id}`)}
                >
                  {singleJob.company?.name}
                </span>
                <span className="hidden md:block text-gray-300">|</span>
                <span className="text-gray-500 text-sm flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                  <Clock size={14} /> Application deadline:{" "}
                  {new Date(applicationDeadline).toLocaleDateString("en-GB")}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <InfoBox
                  icon={<DollarSign size={20} />}
                  label="Salary"
                  value={formatSalary(salary)}
                  className="text-[#6A38C2]"
                />
                <InfoBox
                  icon={<MapPin size={20} />}
                  label="Location"
                  value={formatLocation(location)}
                />
                <InfoBox
                  icon={<Briefcase size={20} />}
                  label="Experience"
                  value={`${experienceLevel} Years`}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-2">
                {/* --- UPDATED APPLY BUTTON --- */}
                <Button
                  className={`h-11 px-10 text-base font-bold rounded-lg flex-1 md:flex-none shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]
                            ${
                              applicationCount >= MAX_APPLY_LIMIT || isExpired
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200"
                                : "bg-[#6A38C2] hover:bg-[#582bb6] text-white"
                            }`}
                  disabled={
                    applicationCount >= MAX_APPLY_LIMIT ||
                    isExpired ||
                    isApplying
                  }
                  onClick={() =>
                    applicationCount < MAX_APPLY_LIMIT &&
                    !isExpired &&
                    (user ? setOpenResumeDialog(true) : navigate("/login"))
                  }
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {isApplying
                    ? "Applying..."
                    : isExpired
                    ? "Job Closed"
                    : applicationCount >= MAX_APPLY_LIMIT
                    ? "Max Applications Reached" // Đã đủ 3 lần
                    : applicationCount > 0
                    ? `Reapply (${applicationCount}/${MAX_APPLY_LIMIT})` // Nút Reapply
                    : "Apply Now"}
                </Button>

                <Button
                  variant="outline"
                  className={`h-11 px-6 rounded-lg border-gray-300 font-semibold flex-1 md:flex-none hover:bg-purple-50 hover:text-[#6A38C2] hover:border-purple-200 transition-all ${
                    isSaved
                      ? "text-red-500 border-red-200 bg-red-50"
                      : "text-gray-700"
                  }`}
                  onClick={handleSaveToggle}
                >
                  <Heart
                    size={18}
                    className={`mr-2 ${isSaved ? "fill-red-500" : ""}`}
                  />
                  {isSaved ? "Saved" : "Save Job"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 md:px-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <SectionTitle title="Job Description" />
              <div className="text-gray-700 leading-relaxed whitespace-pre-line text-[15px]">
                {description}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <SectionTitle title="Requirements" />
              <ul className="space-y-3 mt-4">
                {requirements?.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#6A38C2] mt-0.5 shrink-0" />
                    <span className="text-gray-700 text-[15px]">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <SectionTitle title="Benefits" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {benefits?.map((ben, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 bg-purple-50/50 rounded-lg border border-purple-100 hover:border-purple-200 transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6A38C2]" />
                    <span className="text-gray-800 font-medium text-sm">
                      {ben}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <SectionTitle title="Working Location" />
              <div className="flex items-start gap-3 mt-4 text-gray-700">
                <MapPin className="text-[#6A38C2] shrink-0" />
                <p>{formatLocation(location)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm rounded-xl bg-white top-24">
            <CardContent className="p-6">
              <h4 className="font-bold text-gray-900 mb-5 text-lg">
                General Information
              </h4>

              <div className="space-y-5">
                <GeneralInfoItem
                  icon={<Briefcase size={20} />}
                  label="Job Type"
                  value={jobType}
                />
                <Separator />

                <GeneralInfoItem
                  icon={<Flag size={20} />}
                  label="Seniority Level"
                  value={seniorityLevel || "Not specified"}
                />
                <Separator />

                <GeneralInfoItem
                  icon={<Users size={20} />}
                  label="Positions"
                  value={`${numberOfPositions || 1} openings`}
                />
                <Separator />

                <GeneralInfoItem
                  icon={<MonitorPlay size={20} />}
                  label="Category"
                  value={singleJob.category.name}
                />
                <Separator />

                <GeneralInfoItem
                  icon={<Hourglass size={20} />}
                  label="Days Left"
                  value={
                    <span
                      className={
                        daysLeft <= 3
                          ? "text-red-500 font-bold"
                          : "text-green-600 font-bold"
                      }
                    >
                      {isExpired ? "Expired" : `${daysLeft} Days`}
                    </span>
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="text-[#6A38C2]" />
                <h4 className="font-bold text-gray-900 text-lg">Company</h4>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-14 w-14 border bg-white rounded-lg">
                  <AvatarImage src={company?.logo} />
                  <AvatarFallback>
                    <Building2 />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-gray-900 truncate">
                    {company?.name}
                  </p>
                  <a
                    href={company?.website}
                    target="_blank"
                    className="text-xs text-gray-500 hover:text-[#6A38C2] flex items-center gap-1 mt-1"
                  >
                    <Globe size={10} /> Visit website
                  </a>
                </div>
              </div>

              {singleJob.company.location && (
                <div className="text-sm text-gray-600 flex gap-2 mb-4">
                  <MapPin size={16} className="shrink-0 mt-0.5 text-gray-400" />
                  <span className="line-clamp-2">
                    {singleJob.company.location}
                  </span>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full border-[#6A38C2] text-[#6A38C2] hover:bg-purple-50"
                onClick={() => navigate(`/company/${singleJob.company._id}`)}
              >
                View Company Profile
              </Button>
            </CardContent>
          </Card>

          <div className="bg-[#E6E0F8] rounded-xl p-6 text-center">
            <h4 className="font-bold text-[#6A38C2] mb-2">Refer a Friend?</h4>
            <p className="text-sm text-gray-600 mb-4">
              Share this opportunity with someone who might be interested.
            </p>
            <Button
              className="bg-white text-[#6A38C2] hover:bg-white/90 w-full shadow-sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              }}
            >
              Copy Link
            </Button>
          </div>
        </div>
      </div>

      <ResumeSelectionDialog
        open={openResumeDialog}
        setOpen={setOpenResumeDialog}
        resumes={cvs}
        onSelectResume={(cvId, coverLetter) =>
          handleApplyWrapper(cvId, coverLetter)
        }
        onSelectProfile={(text) => handleApplyWrapper(null, text)}
      />
    </div>
  );
};

const JobSkeletonTopCVStyle = () => (
  <div className="min-h-screen bg-[#F0F2F5] pb-20">
    <div className="bg-white pt-10 pb-12 mb-6 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="h-32 w-32 rounded-xl shrink-0" />
          <div className="flex-1 space-y-4 w-full">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
      <div className="lg:col-span-4 space-y-6">
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

export default JobDescription;
