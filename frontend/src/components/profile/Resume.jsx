import React from "react";
import { useSelector } from "react-redux";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Star,
  FolderGit2,
  ExternalLink,
  Heart,
  Zap,
  Github,
  Linkedin,
  Globe,
  Twitter,
  LayoutTemplate,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// --- Helper Functions & Components ---

const formatDate = (str) => {
  if (!str) return "";
  try {
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch (e) {
    return str;
  }
};

const getSocialIcon = (platform) => {
  if (!platform) return Globe;
  const p = platform.toLowerCase();
  if (p.includes("github")) return Github;
  if (p.includes("linkedin")) return Linkedin;
  if (p.includes("twitter")) return Twitter;
  return Globe;
};

const SectionHeader = ({ title, icon: Icon, className = "" }) => (
  <div
    className={`flex items-center gap-3 mb-4 border-b-2 border-gray-100 pb-2 ${className}`}
  >
    <div className="p-1.5 bg-[#6A38C2]/10 rounded-lg text-[#6A38C2] print:bg-transparent print:p-0">
      <Icon size={20} />
    </div>
    <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider print:text-black">
      {title}
    </h2>
  </div>
);

const DateRange = ({ start, end, isCurrent }) => (
  <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100 print:bg-transparent print:border-none print:p-0 print:text-gray-600">
    {formatDate(start)} — {isCurrent || !end ? "Present" : formatDate(end)}
  </span>
);

// --- Main Component ---

const StudentResume = () => {
  const { user } = useSelector((store) => store.auth);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-400 font-medium italic">
        Please log in to view your resume.
      </div>
    );
  }

  const p = user.profile || {};

  return (
    <div className="bg-gray-100/50 py-8 print:py-0 print:bg-white">
      <div
        id="resume-content"
        className="max-w-[210mm] mx-auto bg-white shadow-2xl rounded-xl overflow-hidden print:shadow-none print:rounded-none print:max-w-none min-h-[297mm]"
      >
        {/* === HEADER === */}
        <header className="bg-[#6A38C2] text-white p-10 print:bg-white print:text-black print:p-0 print:pb-6 print:border-b-2 print:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none">
                {user.fullName}
              </h1>
              <p className="text-xl text-purple-100 font-medium mt-2 tracking-wide print:text-gray-600">
                {p.title || "Professional Title"}
              </p>
            </div>

            {/* Social Links (Right Side of Header) */}
            {p.socialLinks?.length > 0 && (
              <div className="flex flex-wrap gap-3 print:hidden">
                {p.socialLinks.map((link, i) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white border border-white/20"
                      title={link.platform}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Contact Info Bar */}
          <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-purple-50 print:text-gray-700 print:border-gray-200 print:mt-4 print:pt-4">
            {user.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} /> {user.email}
              </div>
            )}
            {user.phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone size={14} /> {user.phoneNumber}
              </div>
            )}
            {user.address && (
              <div className="flex items-center gap-2">
                <MapPin size={14} /> {user.address}
              </div>
            )}
            {p.socialLinks?.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="hidden print:flex items-center gap-2 text-gray-700 underline"
              >
                <Globe size={14} /> {link.platform}
              </a>
            ))}
          </div>
        </header>

        <div className="p-10 grid grid-cols-1 md:grid-cols-12 gap-10 print:p-0 print:mt-8 print:block">
          {/* === LEFT COLUMN (Main Content) === */}
          <div className="md:col-span-8 space-y-8 print:w-full">
            {/* 1. SUMMARY */}
            {(user.bio || p.careerObjective) && (
              <section>
                <SectionHeader
                  title="Professional Summary"
                  icon={LayoutTemplate}
                />
                <p className="text-gray-700 leading-relaxed text-sm text-justify">
                  {p.careerObjective || user.bio}
                </p>
              </section>
            )}

            {/* 2. WORK EXPERIENCE */}
            {p.workExperience?.length > 0 && (
              <section>
                <SectionHeader title="Work Experience" icon={Briefcase} />
                <div className="space-y-6">
                  {p.workExperience.map((job, i) => (
                    <div
                      key={i}
                      className="relative pl-5 border-l-2 border-gray-200 print:border-l-0 print:pl-0"
                    >
                      {/* Timeline Dot (Screen only) */}
                      <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-[3px] border-[#6A38C2] print:hidden" />

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {job.position}
                        </h3>
                        <DateRange
                          start={job.startDate}
                          end={job.endDate}
                          isCurrent={job.isCurrent}
                        />
                      </div>
                      <div className="text-[#6A38C2] font-semibold text-sm mb-2 print:text-black">
                        {job.company}
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed text-justify">
                        {job.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. PROJECTS */}
            {p.projects?.length > 0 && (
              <section>
                <SectionHeader title="Projects" icon={FolderGit2} />
                <div className="space-y-5">
                  {p.projects.map((proj, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-xl p-5 border border-gray-100 print:bg-transparent print:border print:border-gray-300 print:p-4 print:break-inside-avoid"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                            {proj.title}
                            {proj.link && (
                              <a
                                href={proj.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-400 hover:text-[#6A38C2] print:hidden"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                          </h3>
                          {proj.link && (
                            <a
                              href={proj.link}
                              className="text-xs text-[#6A38C2] hover:underline hidden print:block"
                            >
                              {proj.link}
                            </a>
                          )}
                        </div>
                        <DateRange
                          start={proj.startDate}
                          end={proj.endDate}
                          isCurrent={proj.isWorking}
                        />
                      </div>

                      {proj.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {(Array.isArray(proj.technologies)
                            ? proj.technologies
                            : proj.technologies.split(",")
                          ).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600 uppercase tracking-wide print:border-gray-400"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-gray-600 leading-relaxed text-justify">
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. OPERATIONS / ACTIVITIES */}
            {p.operations?.length > 0 && (
              <section>
                <SectionHeader title="Leadership & Activities" icon={Zap} />
                <div className="space-y-4">
                  {p.operations.map((op, i) => (
                    <div key={i} className="group">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-gray-900">
                          {op.position}{" "}
                          <span className="font-normal text-gray-500">
                            at {op.title}
                          </span>
                        </h3>
                        <DateRange
                          start={op.startDate}
                          end={op.endDate}
                          isCurrent={op.isCurrent}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1 text-justify">
                        {op.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* === RIGHT COLUMN (Side Info) === */}
          <div className="md:col-span-4 space-y-9 print:w-full print:mt-8 print:grid print:grid-cols-2 print:gap-8 print:space-y-0">
            {/* 1. EDUCATION */}
            {p.education?.length > 0 && (
              <section className="print:col-span-2">
                <SectionHeader title="Education" icon={GraduationCap} />
                <div className="space-y-5">
                  {p.education.map((edu, i) => (
                    <div key={i}>
                      <h3 className="font-bold text-gray-900 leading-tight">
                        {edu.school}
                      </h3>
                      <p className="text-[#6A38C2] font-medium text-sm mt-0.5 print:text-black">
                        {edu.degree}
                      </p>
                      {edu.major && (
                        <p className="text-xs text-gray-500 italic mb-1">
                          {edu.major}
                        </p>
                      )}
                      <DateRange
                        start={edu.startDate}
                        end={edu.endDate}
                        isCurrent={edu.isCurrent}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 2. SKILLS */}
            {p.skills?.length > 0 && (
              <section>
                <SectionHeader title="Skills" icon={Star} />
                <div className="flex flex-wrap gap-2">
                  {p.skills.map((s, i) => {
                    const name = typeof s === "object" ? s.name : s;
                    const level = typeof s === "object" ? s.level : null;
                    return (
                      <div
                        key={i}
                        className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 print:bg-white print:border-gray-400"
                      >
                        <span className="block font-bold">{name}</span>
                        {level && (
                          <span className="block text-[10px] text-gray-500 font-normal uppercase mt-0.5">
                            {level}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 3. LANGUAGES */}
            {p.languages?.length > 0 && (
              <section>
                <SectionHeader title="Languages" icon={Languages} />
                <ul className="space-y-3">
                  {p.languages.map((lang, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0"
                    >
                      <span className="font-semibold text-gray-800">
                        {lang.language}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                        {lang.level || lang.proficiency}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 4. CERTIFICATIONS */}
            {p.certifications?.length > 0 && (
              <section>
                <SectionHeader title="Certifications" icon={Award} />
                <div className="space-y-4">
                  {p.certifications.map((cert, i) => (
                    <div key={i} className="text-sm">
                      <p className="font-bold text-gray-800 leading-snug">
                        {cert.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {cert.organization}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-gray-400 font-medium">
                          {formatDate(cert.dateIssued)}
                        </span>
                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-[#6A38C2] hover:underline flex items-center gap-0.5 print:text-black"
                          >
                            View <ExternalLink size={8} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. INTERESTS */}
            {p.interests &&
              (typeof p.interests === "string" ||
                Array.isArray(p.interests)) && (
                <section>
                  <SectionHeader title="Interests" icon={Heart} />
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(p.interests)
                      ? p.interests
                      : p.interests.split(",")
                    ).map((int, i) => {
                      if (!int.trim()) return null;
                      return (
                        <span
                          key={i}
                          className="px-2 py-1 bg-white border border-gray-200 rounded-full text-[11px] text-gray-600 font-medium shadow-sm print:shadow-none print:border-gray-400"
                        >
                          {int.trim()}
                        </span>
                      );
                    })}
                  </div>
                </section>
              )}
          </div>
        </div>

        {/* Footer for Print */}
        <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
          Generated by JobPortal - {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default StudentResume;
