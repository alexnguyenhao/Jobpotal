import React from "react";
import { useSelector } from "react-redux";
import {
  Mail,
  Phone,
  MapPin,
  User2,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Star,
  FolderGit2,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// --- Helper Components ---

const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
    <div className="p-1.5 bg-purple-50 rounded-md text-[#6A38C2]">
      <Icon size={20} />
    </div>
    <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
      {title}
    </h2>
  </div>
);

const ContactItem = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 text-gray-600 text-sm">
    <Icon size={14} className="text-[#6A38C2]" />
    <span>{text}</span>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
    <p className="text-gray-400 text-sm italic">{text}</p>
  </div>
);

const formatDate = (str) => {
  if (!str) return "";
  try {
    const d = new Date(str);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch (e) {
    return str;
  }
};

// --- Main Component ---

const StudentResume = () => {
  const { user } = useSelector((store) => store.auth);

  if (!user) {
    return (
      <div className="p-20 text-center text-gray-500 font-medium">
        No user profile found. Please login again.
      </div>
    );
  }

  const p = user.profile || {};

  return (
    <div className="max-w-[210mm] mx-auto bg-white shadow-xl rounded-none md:rounded-lg my-8 min-h-[297mm] overflow-hidden print:shadow-none print:my-0 print:rounded-none">
      {/* --- HEADER --- */}
      <header className="bg-[#6A38C2] text-white p-8 md:p-12 text-center print:bg-gray-800 print:text-black">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 uppercase">
          {user.fullName}
        </h1>
        <p className="text-lg md:text-xl font-light opacity-90 tracking-wide mb-4">
          {p.title || "Professional Title"}
        </p>

        {/* Contact Info Grid */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm opacity-90 mt-4">
          {user.email && (
            <span className="flex items-center gap-1.5">
              <Mail size={14} /> {user.email}
            </span>
          )}
          {user.phoneNumber && (
            <span className="flex items-center gap-1.5">
              <Phone size={14} /> {user.phoneNumber}
            </span>
          )}
          {user.address && (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} /> {user.address}
            </span>
          )}
          {user.dateOfBirth && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />{" "}
              {new Date(user.dateOfBirth).toLocaleDateString()}
            </span>
          )}
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="p-8 md:p-12 space-y-10">
        {/* SUMMARY */}
        {(user.bio || p.careerObjective) && (
          <section>
            <SectionHeader title="Professional Summary" icon={User2} />
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              {user.bio || p.careerObjective}
            </p>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* LEFT COLUMN (Main Info) */}
          <div className="md:col-span-2 space-y-10">
            {/* EXPERIENCE */}
            <section>
              <SectionHeader title="Experience" icon={Briefcase} />
              {p.workExperience?.length > 0 ? (
                <div className="space-y-6">
                  {p.workExperience.map((job, i) => (
                    <div
                      key={i}
                      className="relative pl-4 border-l-2 border-gray-200"
                    >
                      <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#6A38C2]" />
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-1">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {job.position}
                        </h3>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded whitespace-nowrap mt-1 sm:mt-0">
                          {formatDate(job.startDate)} -{" "}
                          {job.endDate ? formatDate(job.endDate) : "Present"}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#6A38C2] mb-2">
                        {job.company}
                      </p>
                      <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState text="No work experience listed." />
              )}
            </section>

            {/* PROJECTS */}
            <section>
              <SectionHeader title="Projects" icon={FolderGit2} />
              {p.projects?.length > 0 ? (
                <div className="grid gap-4">
                  {p.projects.map((proj, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-800">{proj.name}</h3>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#6A38C2] hover:underline text-xs flex items-center gap-1"
                          >
                            Link <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <p className="text-xs text-gray-500 font-medium mb-2 mt-1">
                          Stack:{" "}
                          {Array.isArray(proj.technologies)
                            ? proj.technologies.join(", ")
                            : proj.technologies}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState text="Add personal or academic projects." />
              )}
            </section>
          </div>

          {/* RIGHT COLUMN (Side Info) */}
          <div className="md:col-span-1 space-y-10">
            {/* EDUCATION */}
            <section>
              <SectionHeader title="Education" icon={GraduationCap} />
              {p.education?.length > 0 ? (
                <div className="space-y-5">
                  {p.education.map((edu, i) => (
                    <div key={i}>
                      <h3 className="font-bold text-gray-900 text-sm">
                        {edu.school}
                      </h3>
                      <p className="text-sm text-[#6A38C2] font-medium">
                        {edu.degree}
                      </p>
                      {edu.major && (
                        <p className="text-xs text-gray-500 italic">
                          {edu.major}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(edu.startDate)} -{" "}
                        {edu.endDate ? formatDate(edu.endDate) : "Present"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState text="Add education." />
              )}
            </section>

            {/* SKILLS */}
            <section>
              <SectionHeader title="Skills" icon={Star} />
              {p.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {p.skills.map((s, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-normal"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              ) : (
                <EmptyState text="List your top skills." />
              )}
            </section>

            {/* LANGUAGES */}
            <section>
              <SectionHeader title="Languages" icon={Languages} />
              {p.languages?.length > 0 ? (
                <ul className="space-y-2 text-sm text-gray-700">
                  {p.languages.map((lang, i) => (
                    <li
                      key={i}
                      className="flex justify-between border-b border-dashed border-gray-200 pb-1"
                    >
                      <span className="font-medium">{lang.language}</span>
                      <span className="text-gray-500 text-xs">
                        {lang.level || lang.proficiency}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState text="Add languages." />
              )}
            </section>

            {/* CERTIFICATIONS & AWARDS */}
            <section>
              <SectionHeader title="Awards & Certs" icon={Award} />
              {p.certifications?.length > 0 || p.achievements?.length > 0 ? (
                <div className="space-y-4 text-sm">
                  {/* Combine both lists for simplicity in sidebar */}
                  {p.certifications?.map((cert, i) => (
                    <div key={`cert-${i}`}>
                      <p className="font-bold text-gray-800">{cert.name}</p>
                      <p className="text-xs text-gray-500">
                        {cert.organization} • {formatDate(cert.dateIssued)}
                      </p>
                    </div>
                  ))}
                  {p.achievements?.map((ach, i) => (
                    <div key={`ach-${i}`}>
                      <p className="font-bold text-gray-800">{ach.title}</p>
                      <p className="text-xs text-gray-500">{ach.year}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState text="Add awards." />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResume;
