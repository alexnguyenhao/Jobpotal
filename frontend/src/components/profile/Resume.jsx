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
} from "lucide-react";

// ================= UI COMPONENTS =================
const Section = ({ title, icon, children }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-[#6A38C2] flex items-center gap-2 mb-3">
      {icon} {title}
    </h2>
    {children}
  </div>
);

const Empty = ({ text }) => (
  <p className="text-gray-400 text-sm italic">{text}</p>
);

const formatDate = (str) => {
  if (!str) return "";
  const d = new Date(str);
  return `${d.getMonth() + 1}/${d.getFullYear()}`;
};

// ================= MAIN COMPONENT =================
const StudentResume = () => {
  const { user } = useSelector((store) => store.auth);

  if (!user) {
    return (
      <div className="p-10 text-center text-gray-500">
        No user profile found. Please login again.
      </div>
    );
  }

  const p = user.profile || {};

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-10 my-10 border border-gray-200 font-sans text-gray-900 leading-relaxed">
      {/* ----------- HEADER ------------- */}
      <header className="border-b pb-6 mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-[#6A38C2]">
          {user.fullName}
        </h1>

        <p className="text-lg text-gray-700 mt-1">
          {p.title || "Your Professional Summary"}
        </p>

        {user.bio && (
          <p className="text-gray-600 text-sm max-w-2xl mx-auto mt-2">
            {user.bio}
          </p>
        )}

        {p.careerObjective && (
          <p className="text-gray-500 italic text-sm max-w-xl mx-auto mt-2">
            {p.careerObjective}
          </p>
        )}

        {/* Contact + Personal Info */}
        <div className="flex flex-wrap justify-center gap-6 mt-5 text-sm text-gray-700">
          {user.dateOfBirth && (
            <span className="flex items-center gap-1">
              <Calendar size={16} className="text-[#6A38C2]" />
              {user.dateOfBirth.split("T")[0]}
            </span>
          )}

          {user.gender && (
            <span className="flex items-center gap-1">
              <User2 size={16} className="text-[#6A38C2]" />
              {user.gender}
            </span>
          )}

          {user.email && (
            <span className="flex items-center gap-1">
              <Mail size={16} className="text-[#6A38C2]" />
              {user.email}
            </span>
          )}

          {user.phoneNumber && (
            <span className="flex items-center gap-1">
              <Phone size={16} className="text-[#6A38C2]" />
              {user.phoneNumber}
            </span>
          )}

          {user.address && (
            <span className="flex items-center gap-1">
              <MapPin size={16} className="text-[#6A38C2]" />
              {user.address}
            </span>
          )}
        </div>
      </header>

      {/* ----------- SKILLS ------------- */}
      <Section title="Skills" icon={<Star />}>
        {p.skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {p.skills.map((s, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-[#6A38C2]/10 text-[#6A38C2] rounded-full text-sm"
              >
                {s}
              </span>
            ))}
          </div>
        ) : (
          <Empty text="Add your skills to stand out." />
        )}
      </Section>

      {/* ----------- EXPERIENCE ------------- */}
      <Section title="Professional Experience" icon={<Briefcase />}>
        {p.workExperience?.length ? (
          p.workExperience.map((job, i) => (
            <div key={i} className="mb-6">
              <h3 className="text-xl font-semibold">{job.position}</h3>
              <p className="text-sm text-gray-600">
                {job.company} • {formatDate(job.startDate)} –{" "}
                {job.endDate ? formatDate(job.endDate) : "Present"}
              </p>
              <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                {job.description}
              </p>
            </div>
          ))
        ) : (
          <Empty text="No work experience yet." />
        )}
      </Section>

      {/* ----------- EDUCATION ------------- */}
      <Section title="Education" icon={<GraduationCap />}>
        {p.education?.length ? (
          p.education.map((edu, i) => (
            <div key={i} className="mb-5">
              <h3 className="font-semibold">{edu.degree}</h3>
              <p className="text-sm text-gray-600">
                {edu.school} {edu.major && `— ${edu.major}`}
              </p>
              <p className="text-sm text-gray-600">
                {formatDate(edu.startDate)} –{" "}
                {edu.endDate ? formatDate(edu.endDate) : "Present"}
              </p>
            </div>
          ))
        ) : (
          <Empty text="Add your education details." />
        )}
      </Section>

      {/* ----------- LANGUAGES ------------- */}
      <Section title="Languages" icon={<Languages />}>
        {p.languages?.length ? (
          p.languages.map((lang, i) => (
            <p key={i} className="text-sm">
              • {lang.language} — {lang.level || lang.proficiency}
            </p>
          ))
        ) : (
          <Empty text="No languages added yet." />
        )}
      </Section>

      {/* ----------- CERTIFICATIONS ------------- */}
      <Section title="Certifications" icon={<Award />}>
        {p.certifications?.length ? (
          p.certifications.map((cert, i) => (
            <div key={i} className="mb-3">
              <h3 className="font-semibold">{cert.name}</h3>
              <p className="text-sm text-gray-500">
                {cert.organization}{" "}
                {cert.dateIssued && `• Issued: ${formatDate(cert.dateIssued)}`}
              </p>
            </div>
          ))
        ) : (
          <Empty text="No certifications added yet." />
        )}
      </Section>

      {/* ----------- PROJECTS ------------- */}
      <Section title="Projects" icon={<FolderGit2 />}>
        {p.projects?.length ? (
          p.projects.map((proj, i) => (
            <div key={i} className="mb-4">
              <h3 className="text-lg font-semibold">{proj.name}</h3>

              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#6A38C2] underline text-sm"
                >
                  {proj.link}
                </a>
              )}

              <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                {proj.description}
              </p>
            </div>
          ))
        ) : (
          <Empty text="Add your personal or school projects." />
        )}
      </Section>

      {/* ----------- ACHIEVEMENTS ------------- */}
      <Section title="Achievements" icon={<Star />}>
        {p.achievements?.length ? (
          p.achievements.map((ach, i) => (
            <div key={i} className="mb-3">
              <h3 className="font-semibold">{ach.title}</h3>
              <p className="text-sm text-gray-700">{ach.description}</p>
              <p className="text-sm text-gray-500">{ach.year}</p>
            </div>
          ))
        ) : (
          <Empty text="No achievements added." />
        )}
      </Section>
    </div>
  );
};

export default StudentResume;
