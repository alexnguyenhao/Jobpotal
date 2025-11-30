import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAdminJobDetail from "@/hooks/adminhooks/useAdminJobDetail";
import useAdminJob from "@/hooks/adminhooks/useAdminJob";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Banknote,
  Clock,
  CalendarDays,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Users,
  Loader2,
  Hash,
  ShieldCheck,
  Lock,
  Unlock,
  ShieldAlert, // Thêm icon cảnh báo
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

// --- HELPER FUNCTIONS ---
const formatLocation = (loc) => {
  if (!loc) return "Remote";
  if (typeof loc === "string") return loc;
  return loc.province || loc.address || "Unknown Location";
};

const formatSalary = (salary) => {
  if (!salary) return "Negotiable";
  const { min, max, currency, isNegotiable } = salary;
  if (isNegotiable) return "Negotiable";
  const fmt = (n) => (n >= 1000000 ? `${n / 1000000}M` : `${n / 1000}K`);
  if (min && max) return `${fmt(min)} - ${fmt(max)} ${currency || "VND"}`;
  if (min) return `From ${fmt(min)} ${currency || "VND"}`;
  return "Negotiable";
};

const parseStringToArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.split("\n").filter((item) => item.trim() !== "");
};
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
  <div className="flex items-start justify-between text-sm py-3 border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-3 text-gray-500">
      <Icon size={16} />
      <span>{label}</span>
    </div>
    <div className="text-right">
      <span className="font-medium text-gray-900 block">{value}</span>
      {subValue && <span className="text-xs text-gray-400">{subValue}</span>}
    </div>
  </div>
);

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { job, loading } = useAdminJobDetail(id);
  const { toggleJobStatus } = useAdminJob();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    toggleJobStatus(job._id, job.status === "Open" ? "Closed" : "Open");
    window.location.reload();
    setIsUpdating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50/50">
        <Loader2 className="h-10 w-10 animate-spin text-[#6A38C2]" />
        <p className="text-gray-500 text-sm font-medium">
          Loading Job Details...
        </p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 bg-gray-50/50">
        <Briefcase size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-semibold">Job Not Found</p>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/jobs")}
          className="mt-4"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to List
        </Button>
      </div>
    );
  }

  const isClosed = job.status === "Closed";
  const isExpired = new Date(job.applicationDeadline) < new Date();
  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-6xl mx-auto pt-6 px-4 md:px-0 mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/jobs")}
          className="text-gray-500 hover:text-gray-900 pl-0 hover:bg-transparent"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Jobs List
        </Button>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[800px]">
          <div className="bg-slate-900 text-white p-8 md:p-10">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex items-start gap-5">
                <Avatar className="h-20 w-20 rounded-xl border-2 border-white/20 bg-white">
                  <AvatarImage
                    src={job.company?.logo}
                    className="object-cover p-1"
                  />
                  <AvatarFallback className="rounded-xl bg-white text-slate-900 font-bold text-2xl">
                    {job.company?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {job.title}
                    </h1>

                    {isClosed ? (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 px-3">
                        CLOSED / BANNED
                      </Badge>
                    ) : (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 px-3">
                        OPEN
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <Building2 size={16} /> {job.company?.name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} /> {formatLocation(job.location)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end justify-center">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 px-5 py-3 rounded-xl text-center min-w-[140px]">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Salary
                  </p>
                  <p className="font-bold text-lg">
                    {formatSalary(job.salary)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-10">
                <section>
                  <SectionHeader title="Description" icon={Briefcase} />
                  <div className="text-gray-600 leading-7 text-sm whitespace-pre-wrap text-justify">
                    {job.description}
                  </div>
                </section>

                <section>
                  <SectionHeader title="Requirements" icon={CheckCircle2} />
                  <ul className="space-y-3">
                    {parseStringToArray(job.requirements).map((req, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-gray-700"
                      >
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6A38C2] shrink-0" />
                        <span className="leading-relaxed">
                          {req.replace(/^- /, "")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <SectionHeader title="Benefits" icon={Banknote} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {parseStringToArray(job.benefits).map((ben, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-700"
                      >
                        <CheckCircle2
                          size={16}
                          className="text-green-600 shrink-0"
                        />
                        {ben.replace(/^- /, "")}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN (Sidebar) - 4/12 */}
              <div className="lg:col-span-4 space-y-8">
                {/* --- ADMIN ACTION CARD (QUAN TRỌNG) --- */}
                <Card
                  className={`border shadow-sm ${
                    isClosed
                      ? "bg-red-50 border-red-100"
                      : "bg-green-50 border-green-100"
                  }`}
                >
                  <CardContent className="p-6">
                    <h4
                      className={`font-bold mb-4 flex items-center gap-2 ${
                        isClosed ? "text-red-700" : "text-green-700"
                      }`}
                    >
                      {isClosed ? (
                        <ShieldAlert size={18} />
                      ) : (
                        <ShieldCheck size={18} />
                      )}
                      Admin Action
                    </h4>

                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        {isClosed
                          ? "This job is currently CLOSED/BANNED and invisible to candidates."
                          : "This job is OPEN and visible. You can close it if it violates policies."}
                      </p>

                      <Button
                        className="w-full font-bold shadow-none transition-all"
                        size="lg"
                        variant={isClosed ? "default" : "destructive"}
                        disabled={isUpdating}
                        onClick={handleToggle}
                      >
                        {isUpdating ? (
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        ) : isClosed ? (
                          <>
                            <Unlock size={16} className="mr-2" /> Open Job
                          </>
                        ) : (
                          <>
                            <Lock size={16} className="mr-2" /> Close Job
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Overview Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-[#6A38C2]" />
                    Overview
                  </h4>
                  <div className="space-y-1">
                    <OverviewItem
                      icon={CalendarDays}
                      label="Posted Date"
                      value={new Date(job.createdAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    />
                    <OverviewItem
                      icon={Clock}
                      label="Deadline"
                      value={new Date(
                        job.applicationDeadline
                      ).toLocaleDateString("vi-VN")}
                      subValue={isExpired ? "Expired" : null}
                    />
                    <OverviewItem
                      icon={Briefcase}
                      label="Experience"
                      value={`${job.experienceLevel} Years`}
                    />
                    <OverviewItem
                      icon={Layers}
                      label="Level"
                      value={job.seniorityLevel}
                    />
                    <OverviewItem
                      icon={Users}
                      label="Hiring"
                      value={`${job.numberOfPositions} Candidates`}
                    />
                  </div>
                </div>

                {/* Metadata Card */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm uppercase">
                    <Hash size={14} /> Metadata
                  </h4>
                  <div className="space-y-2 text-xs text-gray-500 font-mono">
                    <div className="flex justify-between">
                      <span>Job ID:</span>
                      <span className="text-gray-800">
                        {job._id.slice(-8)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Posted By:</span>
                      <span className="text-gray-800">
                        {job.created_by?.slice(-8)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Applicants:</span>
                      <span className="text-gray-800 font-bold">
                        {job.applications?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
