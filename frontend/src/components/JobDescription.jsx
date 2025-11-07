import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.js";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
} from "@/utils/constant.js";
import { setSingleJob } from "@/redux/jobSlice.js";
import { useDispatch, useSelector } from "react-redux";
import useSavedJobs from "@/hooks/useSavedJobs.jsx";
import { Heart, HeartOff } from "lucide-react";
import { toast } from "sonner";
import {
  DollarSign,
  MapPin,
  Hourglass,
  Clock,
  Send,
  BookmarkCheck,
  CheckCircle,
  Briefcase,
  CalendarDays,
  Users,
  Mail,
  Globe,
  Phone,
  Building2,
} from "lucide-react";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { id: jobId } = useParams();
  const navigate = useNavigate();

  const [isApplied, setIsApplied] = useState(false);
  const { savedJobs, saveJob, unsaveJob, fetchSavedJobs } = useSavedJobs(false);
  const [isSaved, setIsSaved] = useState(false);

  const applyJobHandle = async () => {
    try {
      const res = await axios(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setIsApplied(true);
        dispatch(
          setSingleJob({
            ...singleJob,
            applications: [...singleJob.applications, { applicant: user?._id }],
          })
        );
        toast.success("Applied successfully!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to apply");
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          const applied =
            res.data.job.applications?.some((a) => a.applicant === user?._id) ||
            false;
          setIsApplied(applied);
          const saved = savedJobs?.some(
            (j) => (j._id || j).toString() === jobId
          );
          setIsSaved(saved);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchJob();
  }, [jobId, dispatch, user?._id]);

  const company = singleJob?.company;
  const salary = singleJob?.salary;
  const loc = singleJob?.location;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-10 px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="md:col-span-2 space-y-6">
          {/* JOB HEADER */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  {singleJob?.title}
                  <CheckCircle className="text-[#6A38C2] w-5 h-5" />
                </h1>

                <div className="flex flex-wrap gap-4 text-sm text-gray-700 mt-2">
                  <InfoTag icon={<MapPin />} label={formatLocation(loc)} />
                  <InfoTag icon={<DollarSign />} label={formatSalary(salary)} />
                  <InfoTag
                    icon={<Hourglass />}
                    label={singleJob?.experienceLevel || "Not specified"}
                  />
                </div>

                <div className="mt-3 flex items-center gap-2 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>
                    Deadline:{" "}
                    {singleJob?.applicationDeadline
                      ? new Date(
                          singleJob.applicationDeadline
                        ).toLocaleDateString("en-GB")
                      : "N/A"}
                  </span>
                </div>

                <div className="mt-4 flex gap-3">
                  <Button
                    disabled={isApplied}
                    onClick={!isApplied ? applyJobHandle : undefined}
                    className={`flex items-center gap-2 ${
                      isApplied
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#7209B7] hover:bg-[#5e0994]"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    {isApplied ? "Applied" : "Apply Now"}
                  </Button>

                  <Button
                    onClick={() => {
                      if (isSaved) {
                        unsaveJob(jobId);
                        setIsSaved(false);
                        toast.info("Removed from saved jobs");
                      } else {
                        saveJob(jobId);
                        setIsSaved(true);
                        toast.success("Job saved successfully!");
                      }
                    }}
                    className={`flex items-center gap-2 border transition-all ${
                      isSaved
                        ? "bg-[#6A38C2] text-white hover:bg-[#5e0994]"
                        : "text-[#7209B7] border-[#7209B7] hover:bg-[#f7edff]"
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <Heart className="w-4 h-4 fill-white text-white" />
                        Saved
                      </>
                    ) : (
                      <>
                        <HeartOff className="w-4 h-4" />
                        Save Job
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* JOB DETAILS */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-8">
            <Section title="Job Description" text={singleJob?.description} />
            {singleJob?.requirements?.length > 0 && (
              <Section
                title="Requirements"
                list={singleJob.requirements}
                icon="•"
              />
            )}
            {singleJob?.benefits?.length > 0 && (
              <Section title="Benefits" list={singleJob.benefits} icon="✓" />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* COMPANY CARD */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
            {company?.logo && (
              <img
                src={company.logo}
                alt="Company Logo"
                onClick={() => navigate(`/company/${company._id}`)}
                className="mx-auto h-20 w-20 object-cover rounded-full mb-4 border cursor-pointer hover:scale-105 transition-transform"
              />
            )}
            <h3
              onClick={() => navigate(`/company/${company?._id}`)}
              className="text-xl font-bold text-gray-900 hover:text-[#7209B7] cursor-pointer"
            >
              {company?.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {formatLocation(company?.location)}
            </p>

            <div className="mt-5 space-y-3 text-sm text-gray-700 text-left">
              {company?.industry && (
                <InfoLine icon={<Building2 />} text={company.industry} />
              )}
              {company?.foundedYear && (
                <InfoLine
                  icon={<CalendarDays />}
                  text={`Founded: ${company.foundedYear}`}
                />
              )}
              {company?.website && (
                <InfoLine
                  icon={<Globe />}
                  text={company.website}
                  link={`https://${company.website}`}
                />
              )}
              {company?.email && (
                <InfoLine
                  icon={<Mail />}
                  text={company.email}
                  link={`mailto:${company.email}`}
                />
              )}
              {company?.phone && (
                <InfoLine icon={<Phone />} text={company.phone} />
              )}
            </div>
          </div>

          {/* JOB INFO CARD */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">
              Job Information
            </h4>
            <div className="space-y-3 text-sm text-gray-700">
              <InfoLine
                icon={<Briefcase className="w-4 h-4 text-[#6A38C2]" />}
                text={`Seniority: ${singleJob?.seniorityLevel || "N/A"}`}
              />
              <InfoLine
                icon={<Hourglass className="w-4 h-4 text-[#6A38C2]" />}
                text={`Experience: ${singleJob?.experienceLevel || "N/A"}`}
              />
              <InfoLine
                icon={<DollarSign className="w-4 h-4 text-[#6A38C2]" />}
                text={formatSalary(salary)}
              />
              <InfoLine
                icon={<CalendarDays className="w-4 h-4 text-[#6A38C2]" />}
                text={`Deadline: ${
                  singleJob?.applicationDeadline
                    ? new Date(
                        singleJob.applicationDeadline
                      ).toLocaleDateString("en-GB")
                    : "N/A"
                }`}
              />
              <InfoLine
                icon={<Users className="w-4 h-4 text-[#6A38C2]" />}
                text={`Applicants: ${singleJob?.applications?.length || 0}`}
              />
              <InfoLine
                icon={<Briefcase className="w-4 h-4 text-[#6A38C2]" />}
                text={`Openings: ${singleJob?.numberOfPositions || "1"}`}
              />
              <InfoLine
                icon={<Clock className="w-4 h-4 text-[#6A38C2]" />}
                text={`Posted: ${
                  singleJob?.createdAt
                    ? new Date(singleJob.createdAt).toLocaleDateString("en-GB")
                    : "N/A"
                }`}
              />
              <InfoLine
                icon={<Briefcase className="w-4 h-4 text-[#6A38C2]" />}
                text={`Type: ${
                  singleJob?.jobType?.length > 0
                    ? singleJob.jobType.join(", ")
                    : "N/A"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Sub-components
const InfoTag = ({ icon, label }) => (
  <div className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-1 rounded-full">
    <span className="text-[#6A38C2]">{icon}</span>
    <span>{label}</span>
  </div>
);

const Section = ({ title, text, list, icon }) => (
  <div>
    <h2 className="text-2xl font-semibold text-gray-800 mb-3">{title}</h2>
    {text && (
      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
        {text}
      </p>
    )}
    {list && (
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        {list.map((item, idx) => (
          <li key={idx}>
            {icon && <span className="mr-1 text-[#6A38C2]">{icon}</span>}
            {item}
          </li>
        ))}
      </ul>
    )}
  </div>
);

const InfoLine = ({ icon, text, link }) => (
  <div className="flex items-center gap-2">
    <span className="text-[#6A38C2]">{icon}</span>
    {link ? (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-[#6A38C2] truncate"
      >
        {text}
      </a>
    ) : (
      <span>{text}</span>
    )}
  </div>
);

export default JobDescription;

// ✅ Helpers
const formatLocation = (loc) => {
  if (!loc) return "No location info";
  if (typeof loc === "string") return loc;
  if (typeof loc === "object") {
    const { address, district, province } = loc;
    return [address, district, province].filter(Boolean).join(", ");
  }
  return "N/A";
};

const formatSalary = (salary) => {
  if (!salary) return "Not specified";
  if (typeof salary === "string") return salary;
  const { min, max, currency, isNegotiable } = salary;
  if (isNegotiable) return "Negotiable";
  if (min && max)
    return `${min.toLocaleString()} - ${max.toLocaleString()} ${
      currency || "VND"
    }`;
  if (min) return `From ${min.toLocaleString()} ${currency || "VND"}`;
  if (max) return `Up to ${max.toLocaleString()} ${currency || "VND"}`;
  return "Not specified";
};
