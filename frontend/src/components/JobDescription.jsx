import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

// Hooks & Redux
import { JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import useSavedJobs from "@/hooks/useSavedJobs.jsx";
import useCV from "@/hooks/useCV";
import useApplyJob from "@/hooks/useApplyJob";

// UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Building2,
  CheckCircle2,
  Heart,
  Share2,
  Flag,
  MonitorPlay,
  Hourglass,
  Brain,
  Sparkles,
  Lightbulb,
  XCircle,
  BookOpen,
  Send,
  Layers,
  GraduationCap,
} from "lucide-react";

// --- HELPERS ---
const formatLocation = (loc) => {
  if (!loc) return "Remote";
  if (typeof loc === "string") return loc;
  const { address, ward, district, province } = loc;
  return [address, ward, district, province].filter(Boolean).join(", ");
};

const formatSalary = (salary) => {
  if (!salary) return "Thỏa thuận";
  if (typeof salary === "string") return salary;
  const { min, max, currency, isNegotiable } = salary;
  if (isNegotiable) return "Thỏa thuận";

  const fmt = (n) => {
    if (!n) return "0";
    if (n >= 1000000) return `${+(n / 1000000).toFixed(1)} Triệu`;
    if (n >= 1000) return `${+(n / 1000).toFixed(1)}K`;
    return n.toLocaleString();
  };
  const curr = currency === "USD" ? "$" : "";
  if (min && max) return `${fmt(min)} - ${fmt(max)} ${curr}`;
  if (min) return `Từ ${fmt(min)} ${curr}`;
  if (max) return `Lên tới ${fmt(max)} ${curr}`;
  return "Thỏa thuận";
};

const parseStringToArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data
    .split(/\n/)
    .map((item) => item.trim())
    .filter((item) => item !== "");
};

// --- SUB-COMPONENTS ---

// 1. Icon tròn màu (Style thống nhất)
const StatIcon = ({ icon: Icon }) => (
  <div className="w-10 h-10 rounded-full bg-[#6A38C2]/10 flex items-center justify-center text-[#6A38C2] shrink-0">
    <Icon size={20} />
  </div>
);

// 2. Dòng thông tin sidebar
const GeneralInfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 mb-4 last:mb-0">
    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0 mt-0.5">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-gray-500 text-xs font-medium mb-0.5">{label}</p>
      <p className="text-gray-900 text-sm font-semibold">{value}</p>
    </div>
  </div>
);

// 3. Tiêu đề section
const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-1 h-6 bg-[#6A38C2] rounded-full"></div>
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
  </div>
);

// 4. AI Analysis Card
const JobFitAnalysisCard = ({ analysis, loading, user }) => {
  if (!user)
    return (
      <Card className="border-none shadow-sm bg-gradient-to-br from-[#6A38C2]/5 to-white overflow-hidden mb-6">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="p-3 bg-white rounded-full shadow-sm mb-3">
            <Brain className="w-8 h-8 text-[#6A38C2]" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">
            Phân tích độ phù hợp AI
          </h4>
          <p className="text-sm text-gray-600">
            Đăng nhập để xem mức độ phù hợp của hồ sơ bạn với công việc này.
          </p>
        </CardContent>
      </Card>
    );

  if (loading)
    return (
      <Card className="border-none shadow-sm mb-6 bg-white overflow-hidden">
        <CardContent className="p-6 flex flex-col gap-4 justify-center items-center py-10">
          <div className="relative">
            <Brain className="w-12 h-12 text-[#6A38C2] animate-pulse" />
            <Sparkles className="w-5 h-5 text-yellow-400 absolute -top-1 -right-1 animate-spin" />
          </div>
          <p className="text-sm text-gray-500 font-medium">
            AI đang phân tích hồ sơ...
          </p>
        </CardContent>
      </Card>
    );

  if (!analysis) return null;

  const { fitScore, matchLabel, summary, strengths, missingSkills, advice } =
    analysis;

  // Color logic
  let themeColor =
    fitScore >= 80 ? "emerald" : fitScore >= 50 ? "amber" : "red";
  const colorMap = {
    emerald: {
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      progress: "text-emerald-500",
    },
    amber: {
      text: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      progress: "text-amber-500",
    },
    red: {
      text: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
      progress: "text-red-500",
    },
  };
  const theme = colorMap[themeColor];

  return (
    <Card
      className={`border-none shadow-md overflow-hidden mb-6 ring-1 ring-gray-100`}
    >
      <div
        className={`p-4 border-b border-gray-50 flex items-center justify-between ${theme.bg}`}
      >
        <div className="flex items-center gap-2">
          <Sparkles className={`w-4 h-4 ${theme.text}`} />
          <h4 className={`font-bold text-sm ${theme.text}`}>
            AI Match Analysis
          </h4>
        </div>
        <Badge
          variant="outline"
          className={`${theme.text} bg-white border-current font-bold`}
        >
          {matchLabel}
        </Badge>
      </div>

      <CardContent className="p-5 space-y-5">
        {/* Score Circle */}
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 flex items-center justify-center rounded-full border-4 border-gray-100 shrink-0">
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="26"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className={theme.progress}
                strokeDasharray={163}
                strokeDashoffset={163 - (163 * fitScore) / 100}
              />
            </svg>
            <span className={`text-sm font-bold ${theme.text}`}>
              {fitScore}%
            </span>
          </div>
          <p className="text-xs font-medium text-gray-600 italic leading-relaxed">
            "{summary}"
          </p>
        </div>

        {/* Skills */}
        <div className="space-y-3">
          {strengths?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Điểm mạnh
              </p>
              <div className="flex flex-wrap gap-1.5">
                {strengths.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {missingSkills?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 flex items-center gap-1">
                <XCircle className="w-3 h-3 text-red-500" /> Cần cải thiện
              </p>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-100 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2 flex gap-2 items-start">
            <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-800">
              <span className="font-bold">AI Tip:</span> {advice}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- MAIN COMPONENT ---
const JobDescription = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Global State
  const { singleJob } = useSelector((s) => s.job);
  const { user } = useSelector((s) => s.auth);

  // Custom Hooks
  const { savedJobs, saveJob, unsaveJob } = useSavedJobs();
  const { cvs, fetchMyCVs } = useCV();
  const { applyJob, isApplying } = useApplyJob();

  // Local State
  const [applicationCount, setApplicationCount] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openResumeDialog, setOpenResumeDialog] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const MAX_APPLY_LIMIT = 3;
  const hasFetchedCVs = useRef(false);

  // --- EFFECTS ---
  useEffect(() => {
    if (user && !hasFetchedCVs.current) {
      hasFetchedCVs.current = true;
      fetchMyCVs();
    }
  }, [user]);

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
            const myApps = job.applications?.filter(
              (a) => a.applicant === user._id
            );
            setApplicationCount(myApps?.length || 0);
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

  useEffect(() => {
    // AI Analysis fetch
    const fetchAiAnalysis = async () => {
      if (!user || !jobId) return;
      setIsAiLoading(true);
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/get/${jobId}/analyze`,
          { withCredentials: true }
        );
        if (res.data.success) setAiAnalysis(res.data.aiAnalysis);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAiLoading(false);
      }
    };
    if (singleJob?._id === jobId && user) fetchAiAnalysis();
  }, [jobId, user, singleJob]);

  useEffect(() => {
    if (!user) return;
    setIsSaved(savedJobs?.some((j) => (j._id || j).toString() === jobId));
  }, [savedJobs, jobId, user]);

  // --- HANDLERS ---
  const handleApplyWrapper = async (cvId, coverLetter) => {
    const success = await applyJob(jobId, cvId, coverLetter, singleJob, user);
    if (success) {
      setApplicationCount((prev) => prev + 1);
      setOpenResumeDialog(false);
      toast.success(
        `Ứng tuyển thành công! (${applicationCount + 1}/${MAX_APPLY_LIMIT})`
      );
    }
  };

  const handleSaveToggle = () => {
    if (!user) return navigate("/login");
    if (isSaved) {
      unsaveJob(jobId);
      toast.info("Đã bỏ lưu tin");
    } else {
      saveJob(jobId);
      toast.success("Đã lưu tin tuyển dụng!");
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
    professional,
  } = singleJob;

  const daysLeft = Math.ceil(
    (new Date(applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-[#F3F5F7] pb-10 font-sans">
      {/* --- HEADER SECTION (Sticky & Clean) --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4 break-words">
                {title}
              </h1>

              {/* Key Stats */}
              <div className="flex flex-wrap gap-4 md:gap-8 mb-4">
                <div className="flex items-center gap-3">
                  <StatIcon icon={DollarSign} />
                  <div>
                    <p className="text-gray-500 text-xs">Salary</p>
                    <p className="text-[#6A38C2] font-bold text-base">
                      {formatSalary(salary)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatIcon icon={MapPin} />
                  <div>
                    <p className="text-gray-500 text-xs">Location</p>
                    <p className="text-gray-900 font-bold text-base">
                      {location?.province || "Hồ Chí Minh"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatIcon icon={Hourglass} />
                  <div>
                    <p className="text-gray-500 text-xs">Experience</p>
                    <p className="text-gray-900 font-bold text-base">
                      {experienceLevel || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 w-fit px-3 py-1 rounded-md">
                <Clock size={14} />
                <span>
                  Application deadline:{" "}
                  <strong>
                    {new Date(applicationDeadline).toLocaleDateString("vi-VN")}
                  </strong>
                </span>
                <span
                  className={`font-medium ${
                    isExpired ? "text-red-500" : "text-green-600"
                  }`}
                >
                  ({isExpired ? "Expired" : `Remaining ${daysLeft} days`})
                </span>
              </div>
            </div>

            {/* Apply Actions */}
            <div className="flex flex-row md:flex-col gap-3 shrink-0 justify-start md:justify-center min-w-[200px]">
              <Button
                onClick={() =>
                  !isExpired &&
                  (user ? setOpenResumeDialog(true) : navigate("/login"))
                }
                disabled={
                  applicationCount >= MAX_APPLY_LIMIT || isExpired || isApplying
                }
                className={`h-12 w-full text-base font-bold shadow-md transition-all ${
                  isExpired || applicationCount >= MAX_APPLY_LIMIT
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#6A38C2] hover:bg-[#5b32a8] text-white"
                }`}
              >
                <Send className="w-4 h-4 mr-2" />
                {isApplying
                  ? "Sending..."
                  : isExpired
                  ? "Expired"
                  : applicationCount > 0
                  ? "Reapply"
                  : "Apply now"}
              </Button>

              <Button
                variant="outline"
                onClick={handleSaveToggle}
                className={`h-11 w-full border font-semibold ${
                  isSaved
                    ? "border-red-200 text-red-500 bg-red-50"
                    : "border-gray-300 text-gray-600 hover:text-[#6A38C2] hover:border-[#6A38C2]"
                }`}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${isSaved ? "fill-red-500" : ""}`}
                />
                {isSaved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- BODY CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Job Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 border-l-4 border-[#6A38C2] pl-3">
                    Job details
                  </h2>
                </div>

                {/* Quick Tags Box */}
                <div className="bg-gray-50 rounded-xl p-5 mb-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-semibold text-gray-700 min-w-[100px] mt-1">
                      Specialization:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(professional) &&
                      professional.length > 0 ? (
                        professional.map((pro, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 font-normal"
                          >
                            {pro}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          Not specified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-semibold text-gray-700 min-w-[100px] mt-1">
                      Employment type:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {jobType?.map((type, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 font-normal"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                  <section>
                    <SectionTitle title="Job description" />
                    <div className="text-gray-700 leading-7 text-[15px] whitespace-pre-wrap pl-2">
                      {description}
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <SectionTitle title="Requirements" />
                    <div className="space-y-3 pl-2">
                      {parseStringToArray(requirements).map((req, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></div>
                          <span className="text-gray-700 leading-relaxed text-[15px]">
                            {req.replace(/^[•\-\*]\s*/, "")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <SectionTitle title="Benefits" />
                    <div className="space-y-3 pl-2">
                      {parseStringToArray(benefits).map((ben, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-gray-700 leading-relaxed text-[15px]">
                            {ben.replace(/^[•\-\*]\s*/, "")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <SectionTitle title="Location" />
                    <div className="flex items-start gap-3 text-gray-700 pl-2">
                      <MapPin
                        className="text-[#6A38C2] shrink-0 mt-1"
                        size={20}
                      />
                      <p className="text-[15px]">{formatLocation(location)}</p>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="space-y-6">
            {/* 1. AI Analysis (Priority) */}
            <JobFitAnalysisCard
              analysis={aiAnalysis}
              loading={isAiLoading}
              user={user}
            />

            {/* 2. Company Info */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="text-[#6A38C2]" size={20} />
                  <h4 className="font-bold text-gray-900 text-base">
                    Company Info
                  </h4>
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-14 w-14 border bg-white rounded-lg">
                    <AvatarImage
                      src={company?.logo}
                      className="object-contain p-1"
                    />
                    <AvatarFallback>CP</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3
                      className="font-bold text-gray-900 text-sm line-clamp-2 hover:text-[#6A38C2] cursor-pointer"
                      onClick={() => navigate(`/company/${company?._id}`)}
                    >
                      {company?.name}
                    </h3>
                    <a
                      href={company?.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-gray-500 flex items-center gap-1 mt-1 hover:underline"
                    >
                      <Globe size={12} /> Website
                    </a>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full text-[#6A38C2] border-[#6A38C2] hover:bg-purple-50 h-9 text-sm"
                  onClick={() => navigate(`/company/${company?._id}`)}
                >
                  View company page
                </Button>
              </CardContent>
            </Card>

            {/* 3. General Info */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-5">
                <h4 className="font-bold text-gray-900 mb-5 text-base">
                  General Info
                </h4>
                <GeneralInfoItem
                  icon={Layers}
                  label="Seniority level"
                  value={seniorityLevel || "Employee"}
                />
                <GeneralInfoItem
                  icon={GraduationCap}
                  label="Industry"
                  value={singleJob.category?.name}
                />
                <GeneralInfoItem
                  icon={Users}
                  label="Number of positions"
                  value={`${numberOfPositions} people`}
                />
                <GeneralInfoItem
                  icon={Briefcase}
                  label="Employment type"
                  value={Array.isArray(jobType) ? jobType.join(", ") : jobType}
                />
                <GeneralInfoItem
                  icon={BookOpen}
                  label="Experience"
                  value={experienceLevel}
                />
              </CardContent>
            </Card>

            {/* 4. Share */}
            <div className="bg-[#E6E0F8] rounded-xl p-5 text-center">
              <h4 className="font-bold text-[#6A38C2] mb-1">Share this job?</h4>
              <p className="text-xs text-gray-600 mb-3">
                Copy the link and send to your friends.
              </p>
              <Button
                className="bg-white text-[#6A38C2] hover:bg-white/90 w-full shadow-sm h-9 text-sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Đã sao chép liên kết!");
                }}
              >
                <Share2 size={14} className="mr-2" /> Copy Link
              </Button>
            </div>
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
      />
    </div>
  );
};

const JobSkeletonTopCVStyle = () => (
  <div className="min-h-screen bg-[#F0F2F5] pb-20">
    <div className="bg-white pt-10 pb-12 mb-6 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <Skeleton className="h-8 w-1/2 mb-6" />
        <div className="flex gap-4">
          <Skeleton className="h-32 w-32 rounded-xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-4 mt-4">
              <Skeleton className="h-12 w-32 rounded-lg" />
              <Skeleton className="h-12 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
      <div className="lg:col-span-1 space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-60 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

export default JobDescription;
