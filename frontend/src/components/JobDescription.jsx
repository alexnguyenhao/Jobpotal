import React, { useEffect, useState } from "react";
import NavBar from "@/components/shared/NavBar.jsx";
import { Button } from "@/components/ui/button.js";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
} from "@/utils/constant.js";
import { setSingleJob } from "@/redux/jobSlice.js";
import { useDispatch, useSelector } from "react-redux";
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
  const isInitiallyApplied =
    singleJob?.applications?.some((a) => a.applicant === user?._id) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const dispatch = useDispatch();
  const { id: jobId } = useParams();
  const navigate = useNavigate();

  const applyJobHandle = async () => {
    try {
      const res = await axios(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setIsApplied(true);
        const updatedJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedJob));
        toast.success(res.data.message);
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
          setIsApplied(
            res.data.job.applications.some((a) => a.applicant === user?._id)
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchJob();
  }, [jobId, dispatch, user?._id]);

  const company = singleJob?.company;

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="max-w-6xl mx-auto py-10 px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Left side: Title + info */}
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  {singleJob?.title}
                  <CheckCircle className="text-[#6A38C2] w-5 h-5" />
                </h1>

                <div className="flex flex-wrap gap-6 text-sm text-gray-700 mt-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-[#6A38C2] w-4 h-4" />
                    <span className="font-medium">
                      Salary:{" "}
                      {singleJob?.salary
                        ? `${singleJob.salary.toLocaleString()}M`
                        : "Negotiable"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-[#6A38C2] w-4 h-4" />
                    <span className="font-medium">
                      Location: {singleJob?.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hourglass className="text-[#6A38C2] w-4 h-4" />
                    <span className="font-medium">
                      Experience: {singleJob?.experienceLevel}
                    </span>
                  </div>
                </div>

                {/* Deadline */}
                <div className="mt-3 flex items-center gap-2 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>
                    Application deadline:{" "}
                    {new Date(
                      singleJob?.applicationDeadline
                    ).toLocaleDateString("en-GB")}
                  </span>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={isApplied ? null : applyJobHandle}
                    disabled={isApplied}
                    className={`flex items-center justify-center gap-2 px-6 py-2 rounded-md font-medium text-white text-sm transition-all duration-200 ${
                      isApplied
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#7209B7] hover:bg-[#5e0994]"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    {isApplied ? "Applied" : "Apply Now"}
                  </button>

                  <button className="flex items-center gap-2 px-6 py-2 rounded-md border border-[#7209B7] text-[#7209B7] font-medium text-sm hover:bg-[#f7edff] transition-all">
                    <BookmarkCheck className="w-4 h-4" />
                    Save Job
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Job Description
              </h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {singleJob?.description}
              </p>
            </div>

            {singleJob?.requirements?.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  Requirements
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {singleJob.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {singleJob?.benefits?.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  Benefits
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {singleJob.benefits.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center">
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
              {company?.location || "No location info"}
            </p>

            {/* 🟣 Thông tin chi tiết công ty */}
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

          {/* Job Info */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Job Information
            </h4>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#6A38C2]" />
                <span>Seniority: {singleJob?.seniorityLevel || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hourglass className="w-4 h-4 text-[#6A38C2]" />
                <span>Experience: {singleJob?.experienceLevel || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#6A38C2]" />
                <span>
                  Salary:{" "}
                  {singleJob?.salary
                    ? `${singleJob.salary.toLocaleString()}M`
                    : "Negotiable"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#6A38C2]" />
                <span>
                  Deadline:{" "}
                  {singleJob?.applicationDeadline
                    ? new Date(
                        singleJob.applicationDeadline
                      ).toLocaleDateString("en-GB")
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#6A38C2]" />
                <span>Applicants: {singleJob?.applications?.length || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#6A38C2]" />
                <span>Openings: {singleJob?.numberOfPositions || "1"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6A38C2]" />
                <span>
                  Posted:{" "}
                  {singleJob?.createdAt
                    ? new Date(singleJob.createdAt).toLocaleDateString("en-GB")
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#6A38C2]" />
                <span>
                  Type:{" "}
                  {singleJob?.jobType?.length > 0
                    ? singleJob.jobType.join(", ")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Component InfoLine cho sidebar
const InfoLine = ({ icon, text, link }) => {
  return (
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
};

export default JobDescription;
