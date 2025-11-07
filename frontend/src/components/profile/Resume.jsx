import React from "react";
import { useSelector } from "react-redux";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Star,
  FolderGit2,
} from "lucide-react";

const Resume = () => {
  const { user } = useSelector((store) => store.auth);
  const profile = user?.profile || {};

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-10 my-10 border border-gray-200 font-sans text-gray-800">
      {/* Header */}
      <div className="border-b border-gray-300 pb-6 mb-6 text-center">
        <h1 className="text-3xl font-bold text-[#6A38C2]">
          {user?.fullName || "Full Name"}
        </h1>
        <p className="text-lg text-gray-600">
          {profile.title || "Your professional headline"}
        </p>
        <div className="flex justify-center gap-6 mt-3 text-gray-600 text-sm">
          {user?.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4 text-[#6A38C2]" /> {user.email}
            </span>
          )}
          {user?.phoneNumber && (
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4 text-[#6A38C2]" /> {user.phoneNumber}
            </span>
          )}
          {user?.address && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#6A38C2]" /> {user.address}
            </span>
          )}
        </div>
      </div>

      {/* Section helper */}
      <Section title="Work Experience" icon={<Briefcase />}>
        {profile.workExperience?.length > 0 ? (
          profile.workExperience.map((job, idx) => (
            <div key={idx} className="mb-4">
              <h3 className="font-semibold text-lg">{job.position}</h3>
              <p className="text-sm text-gray-500">
                {job.company} • {job.startDate} – {job.endDate || "Present"}
              </p>
              <p className="text-gray-700 text-sm mt-1 whitespace-pre-line">
                {job.description}
              </p>
            </div>
          ))
        ) : (
          <Empty text="No work experience added yet." />
        )}
      </Section>

      <Section title="Education" icon={<GraduationCap />}>
        {profile.education?.length > 0 ? (
          profile.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <h3 className="font-semibold">{edu.degree}</h3>
              <p className="text-sm text-gray-500">
                {edu.institution} • {edu.year}
              </p>
            </div>
          ))
        ) : (
          <Empty text="No education details yet." />
        )}
      </Section>

      <Section title="Certifications" icon={<Award />}>
        {profile.certifications?.length > 0 ? (
          profile.certifications.map((cert, idx) => (
            <p key={idx} className="text-gray-700 mb-1">
              • {cert}
            </p>
          ))
        ) : (
          <Empty text="No certifications added yet." />
        )}
      </Section>

      <Section title="Languages" icon={<Languages />}>
        {profile.languages?.length > 0 ? (
          profile.languages.map((lang, idx) => (
            <p key={idx} className="text-gray-700 mb-1">
              • {lang}
            </p>
          ))
        ) : (
          <Empty text="No languages added yet." />
        )}
      </Section>

      <Section title="Achievements" icon={<Star />}>
        {profile.achievements?.length > 0 ? (
          profile.achievements.map((ach, idx) => (
            <p key={idx} className="text-gray-700 mb-1">
              • {ach}
            </p>
          ))
        ) : (
          <Empty text="No achievements yet." />
        )}
      </Section>

      <Section title="Projects" icon={<FolderGit2 />}>
        {profile.projects?.length > 0 ? (
          profile.projects.map((proj, idx) => (
            <div key={idx} className="mb-3">
              <h3 className="font-semibold">{proj.name}</h3>
              <p className="text-sm text-gray-500">
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#6A38C2] hover:underline"
                  >
                    {proj.link}
                  </a>
                )}
              </p>
              <p className="text-gray-700 text-sm mt-1 whitespace-pre-line">
                {proj.description}
              </p>
            </div>
          ))
        ) : (
          <Empty text="No projects yet." />
        )}
      </Section>
    </div>
  );
};

// ✅ Reusable section component
const Section = ({ title, icon, children }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-[#6A38C2] flex items-center gap-2 mb-3">
      {icon} {title}
    </h2>
    {children}
  </div>
);

// ✅ Empty state
const Empty = ({ text }) => (
  <p className="text-gray-400 text-sm italic">{text}</p>
);

export default Resume;
