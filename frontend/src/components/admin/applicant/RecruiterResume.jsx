import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import {
  Mail,
  Phone,
  MapPin,
  User2,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Star,
  FolderGit2,
  Printer,
  ExternalLink,
  Loader2,
  Globe,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// --- Helper Components ---

const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-3 mt-8 first:mt-0 print:mt-6 print:border-gray-300">
    <div className="p-2 bg-purple-50 rounded-lg text-[#6A38C2] print:bg-transparent print:text-black print:p-0">
      <Icon size={18} strokeWidth={2.5} />
    </div>
    <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider print:text-black">
      {title}
    </h2>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="py-6 px-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 text-center print:hidden">
    <p className="text-gray-400 text-sm">{text}</p>
  </div>
);

const formatDate = (str) => {
  if (!str) return "";
  try {
    const date = new Date(str);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return str;
  }
};

// --- Main Component ---

const RecruiterResume = () => {
  const { userId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(state?.applicant || null);
  const [loading, setLoading] = useState(!state?.applicant);

  useEffect(() => {
    if (state?.applicant) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${USER_API_END_POINT}/user/${userId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, state]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500 bg-gray-50/50">
        <Loader2 className="h-10 w-10 animate-spin text-[#6A38C2]" />
        <p className="font-medium text-sm">Loading Profile...</p>
      </div>
    );
  }

  // --- NOT FOUND STATE ---
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 bg-gray-50/50">
        <User2 size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-semibold">Profile Not Found</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const p = user.profile || {};

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10 print:bg-white print:p-0">
      {/* Global Styles for Print */}
      <style>
        {`
          @media print {
            @page { margin: 0; size: auto; }
            body { -webkit-print-color-adjust: exact; background-color: white !important; }
            .no-print { display: none !important; }
            .print-container { box-shadow: none !important; border: none !important; margin: 0 !important; width: 100% !important; max-width: none !important; }
          }
        `}
      </style>

      {/* --- NEW HEADER (MATCHING YOUR DESIGN) --- */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 flex items-center justify-between no-print shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Applicant Profile
              {/* Optional: Show status badge */}
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </h1>
            <p className="text-xs text-gray-500">Reviewing candidate details</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleShare}
            className="hidden sm:flex"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>

          {/* Primary Action Button */}
          <Button
            type="button"
            className="bg-[#6A38C2] hover:bg-[#5a2ea6] text-white"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print / PDF
          </Button>
        </div>
      </header>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="max-w-5xl mx-auto mt-8 px-4 md:px-0">
        {/* CV CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden print-container min-h-[800px]">
          {/* CV HEADER BACKGROUND */}
          <div className="bg-slate-900 text-white p-8 md:p-12 print:bg-white print:text-black print:border-b-2 print:border-gray-800 print:p-0 print:pb-6 print:mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white print:text-black">
                  {user.fullName}
                </h1>
                <p className="text-lg text-purple-300 font-medium print:text-gray-600 print:font-bold">
                  {p.title || "Open to Opportunities"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm text-gray-300 print:text-gray-800 print:text-right">
                {user.email && (
                  <div className="flex items-center gap-2 md:justify-end">
                    <Mail size={16} className="text-purple-400 print:hidden" />
                    <span className="print:font-medium">{user.email}</span>
                  </div>
                )}
                {user.phoneNumber && (
                  <div className="flex items-center gap-2 md:justify-end">
                    <Phone size={16} className="text-purple-400 print:hidden" />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center gap-2 md:justify-end">
                    <MapPin
                      size={16}
                      className="text-purple-400 print:hidden"
                    />
                    <span>{user.address}</span>
                  </div>
                )}
                {p.website && (
                  <div className="flex items-center gap-2 md:justify-end">
                    <Globe size={16} className="text-purple-400 print:hidden" />
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline text-purple-200 print:text-black"
                    >
                      Portfolio Link
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CV BODY */}
          <div className="p-8 md:p-12 print:p-0">
            {/* Summary Section */}
            {(user.bio || p.careerObjective) && (
              <section className="mb-10 print:break-inside-avoid">
                <SectionHeader title="Profile Summary" icon={User2} />
                <p className="text-gray-700 leading-7 text-sm text-justify">
                  {user.bio || p.careerObjective}
                </p>
              </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 print:gap-8">
              {/* LEFT COLUMN (Experience & Projects) - 8 Cols */}
              <div className="lg:col-span-8 space-y-10">
                {/* WORK EXPERIENCE */}
                <section>
                  <SectionHeader title="Work Experience" icon={Briefcase} />
                  {p.workExperience?.length > 0 ? (
                    <div className="space-y-8 border-l-2 border-gray-100 ml-3 pl-8 print:border-l-0 print:ml-0 print:pl-0">
                      {p.workExperience.map((job, i) => (
                        <div
                          key={i}
                          className="relative print:break-inside-avoid group"
                        >
                          <span className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-gray-200 group-hover:border-[#6A38C2] transition-colors print:hidden"></span>

                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1.5">
                            <h3 className="font-bold text-gray-900 text-base">
                              {job.position}
                            </h3>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-100 px-2 py-1 rounded print:bg-transparent print:p-0">
                              {formatDate(job.startDate)} —{" "}
                              {job.endDate
                                ? formatDate(job.endDate)
                                : "Present"}
                            </span>
                          </div>

                          <p className="text-sm font-bold text-[#6A38C2] mb-3 print:text-black">
                            {job.company}
                          </p>

                          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                            {job.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState text="No work experience provided." />
                  )}
                </section>

                {/* PROJECTS */}
                <section>
                  <SectionHeader title="Projects" icon={FolderGit2} />
                  {p.projects?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {p.projects.map((proj, i) => (
                        <div
                          key={i}
                          className="bg-gray-50/50 hover:bg-gray-50 p-5 rounded-xl border border-gray-100 transition-colors print:bg-white print:border-gray-300 print:break-inside-avoid"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900 text-sm">
                              {proj.title}
                            </h3>
                            {proj.link && (
                              <a
                                href={proj.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#6A38C2] hover:underline text-xs flex items-center gap-1 print:text-black"
                              >
                                Visit <ExternalLink size={12} />
                              </a>
                            )}
                          </div>

                          {proj.technologies && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {(Array.isArray(proj.technologies)
                                ? proj.technologies
                                : [proj.technologies]
                              ).map((tech, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="bg-white border-gray-200 text-gray-600 hover:bg-white text-[10px] font-normal px-2 print:border-gray-400"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <p className="text-sm text-gray-600 leading-relaxed">
                            {proj.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState text="No projects provided." />
                  )}
                </section>
              </div>

              {/* RIGHT COLUMN (Skills, Edu, Lang) - 4 Cols */}
              <div className="lg:col-span-4 space-y-10">
                {/* SKILLS */}
                <section className="print:break-inside-avoid">
                  <SectionHeader title="Skills" icon={Star} />
                  {p.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {p.skills.map((s, i) => (
                        <Badge
                          key={i}
                          className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium border border-gray-200 px-3 py-1.5 rounded-md print:border-gray-400 print:text-black print:bg-white"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <EmptyState text="No skills listed." />
                  )}
                </section>

                {/* EDUCATION */}
                <section className="print:break-inside-avoid">
                  <SectionHeader title="Education" icon={GraduationCap} />
                  {p.education?.length > 0 ? (
                    <div className="space-y-6">
                      {p.education.map((edu, i) => (
                        <div
                          key={i}
                          className="relative pl-4 border-l-2 border-[#6A38C2] print:border-black"
                        >
                          <h3 className="font-bold text-gray-900 text-sm leading-tight">
                            {edu.school}
                          </h3>
                          <p className="text-sm text-[#6A38C2] font-semibold mt-1 print:text-black">
                            {edu.degree}
                          </p>
                          <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400 font-medium">
                            <Calendar size={12} />
                            {formatDate(edu.startDate)} -{" "}
                            {edu.endDate ? formatDate(edu.endDate) : "Present"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState text="No education listed." />
                  )}
                </section>

                {/* LANGUAGES */}
                <section className="print:break-inside-avoid">
                  <SectionHeader title="Languages" icon={Languages} />
                  {p.languages?.length > 0 ? (
                    <div className="space-y-3">
                      {p.languages.map((lang, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 print:bg-white print:border-none print:p-0 print:border-b print:rounded-none"
                        >
                          <span className="font-semibold text-sm text-gray-800">
                            {lang.language}
                          </span>
                          <span className="text-xs font-medium text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 print:border-gray-300">
                            {lang.level || lang.proficiency}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState text="No languages listed." />
                  )}
                </section>

                {/* CERTIFICATIONS */}
                {(p.certifications?.length > 0 ||
                  p.achievements?.length > 0) && (
                  <section className="print:break-inside-avoid">
                    <SectionHeader title="Awards & Certs" icon={Award} />
                    <div className="space-y-5 text-sm">
                      {p.certifications?.map((cert, i) => (
                        <div key={`c-${i}`}>
                          <p className="font-bold text-gray-800 leading-tight">
                            {cert.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <CheckCircle2
                              size={12}
                              className="text-[#6A38C2]"
                            />
                            {cert.organization}
                          </p>
                        </div>
                      ))}
                      {p.achievements?.map((ach, i) => (
                        <div key={`a-${i}`}>
                          <p className="font-bold text-gray-800 leading-tight">
                            {ach.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Award size={12} className="text-yellow-500" />
                            {ach.year}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER FOR PRINT */}
          <div className="hidden print:flex justify-between items-center text-[10px] text-gray-400 px-0 pt-10 mt-auto border-t border-gray-200">
            <span>Candidate Profile - Generated by JobPortal</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterResume;
