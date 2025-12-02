import React from "react";
import { formatDate, formatRange } from "../../../utils/formatDate";

const ModernTemplate = ({ data }) => {
  // Safe check data
  const info = data?.personalInfo || {};
  const s = data?.styleConfig || {};

  // Data Arrays
  const skills = data?.skills || [];
  const languages = data?.languages || [];
  const education = data?.education || [];
  const experience = data?.workExperience || [];
  const projects = data?.projects || [];
  const certifications = data?.certifications || [];
  const achievements = data?.achievements || [];
  const operations = data?.operations || []; // Hoạt động/Operations
  const interests = data?.interests || "";

  // Style Variables
  const primary = s.primaryColor || "#2B4CFF";
  const wrapperStyle = {
    fontFamily: s.fontFamily || "sans-serif",
    fontSize: s.fontSizeClass || "text-base", // text-sm, text-base
    lineHeight: "1.5",
    color: s.textColor || "#333",
    backgroundColor: s.backgroundColor || "#fff",
  };

  return (
    <div
      className="w-full max-w-[210mm] min-h-[297mm] mx-auto flex shadow-lg"
      style={wrapperStyle}
    >
      {/* --- LEFT SIDEBAR --- */}
      <aside
        className="w-[35%] text-white p-6 flex flex-col gap-6"
        style={{ background: primary }}
      >
        {/* Avatar */}
        <div className="w-32 h-32 mx-auto rounded-full border-4 border-white/40 overflow-hidden shadow-lg flex-shrink-0">
          <img
            src={info.profilePhoto || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Contact Info (FULL) */}
        <div className="space-y-3 text-sm">
          <h3 className="text-lg font-bold border-b border-white/30 pb-1 mb-2">
            Contact
          </h3>

          {info.email && (
            <div className="break-words">
              <span className="font-bold opacity-70 block text-xs">Email</span>
              {info.email}
            </div>
          )}

          {info.phone && (
            <div>
              <span className="font-bold opacity-70 block text-xs">Phone</span>
              {info.phone}
            </div>
          )}

          {info.address && (
            <div>
              <span className="font-bold opacity-70 block text-xs">
                Address
              </span>
              {info.address}
            </div>
          )}

          {info.dateOfBirth && (
            <div>
              <span className="font-bold opacity-70 block text-xs">
                Date of Birth
              </span>
              {formatDate(info.dateOfBirth)}
            </div>
          )}

          {info.gender && (
            <div>
              <span className="font-bold opacity-70 block text-xs">Gender</span>
              <span className="capitalize">{info.gender}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h3 className="text-lg font-bold border-b border-white/30 pb-1 mb-2">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((sk, i) => (
                <span
                  key={i}
                  className="bg-white/20 px-2 py-1 rounded text-xs font-medium"
                >
                  {typeof sk === "object" ? sk.name : sk}
                  {/* Nếu có level thì hiển thị luôn */}
                  {typeof sk === "object" && sk.level ? ` (${sk.level})` : ""}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h3 className="text-lg font-bold border-b border-white/30 pb-1 mb-2">
              Languages
            </h3>
            <ul className="space-y-2 text-sm">
              {languages.map((l, i) => (
                <li key={i} className="flex justify-between">
                  <span>{l.language}</span>
                  <span className="opacity-80 italic text-xs border border-white/30 px-1 rounded">
                    {l.proficiency}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications (Đẩy sang trái cho đỡ trống) */}
        {certifications.length > 0 && (
          <div>
            <h3 className="text-lg font-bold border-b border-white/30 pb-1 mb-2">
              Certifications
            </h3>
            <ul className="space-y-3 text-sm">
              {certifications.map((cert, i) => (
                <li key={i}>
                  <div className="font-bold">{cert.name}</div>
                  <div className="text-xs opacity-80">{cert.organization}</div>
                  {cert.dateIssued && (
                    <div className="text-xs opacity-60 italic">
                      {formatDate(cert.dateIssued)}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Interests */}
        {interests && (
          <div>
            <h3 className="text-lg font-bold border-b border-white/30 pb-1 mb-2">
              Interests
            </h3>
            <p className="text-sm opacity-90 whitespace-pre-line">
              {interests}
            </p>
          </div>
        )}
      </aside>

      {/* --- RIGHT MAIN CONTENT --- */}
      <main className="w-[65%] p-8 bg-white flex flex-col gap-6">
        {/* Header */}
        <div className="border-b-2 pb-4" style={{ borderColor: primary }}>
          <h1
            className="text-4xl font-bold uppercase tracking-wide"
            style={{ color: primary }}
          >
            {info.fullName || "Your Name"}
          </h1>
          <p className="text-xl font-medium mt-1 text-gray-600 uppercase tracking-wider">
            {info.position}
          </p>
        </div>

        {/* Summary */}
        {info.summary && (
          <section>
            <h2
              className="text-lg font-bold uppercase mb-2 flex items-center gap-2"
              style={{ color: primary }}
            >
              Profile
            </h2>
            <p className="text-sm text-justify leading-relaxed whitespace-pre-line text-gray-700">
              {info.summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <section>
            <h2
              className="text-lg font-bold uppercase mb-4"
              style={{ color: primary }}
            >
              Work Experience
            </h2>
            <div className="space-y-5">
              {experience.map((exp, i) => (
                <div
                  key={i}
                  className="relative pl-4 border-l-2 border-gray-200"
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 text-base">
                      {exp.position}
                    </h3>
                    <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600 whitespace-nowrap ml-2">
                      {formatRange(exp.startDate, exp.endDate)}
                    </span>
                  </div>
                  <div className="text-sm font-semibold italic text-gray-600 mb-2">
                    {exp.company}
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2
              className="text-lg font-bold uppercase mb-4"
              style={{ color: primary }}
            >
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between text-gray-900 font-bold">
                    <span>{edu.school}</span>
                    <span className="text-xs font-normal text-gray-500 whitespace-nowrap ml-2">
                      {formatRange(edu.startDate, edu.endDate)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    {edu.degree} {edu.major && <span>• {edu.major}</span>}
                  </div>
                  {edu.description && (
                    <p className="text-xs text-gray-500 mt-1 italic">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2
              className="text-lg font-bold uppercase mb-4"
              style={{ color: primary }}
            >
              Projects
            </h2>
            <div className="space-y-4">
              {projects.map((proj, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-3 rounded border border-gray-100"
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-800">{proj.title}</h3>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Live Link ↗
                      </a>
                    )}
                  </div>
                  {proj.technologies?.length > 0 && (
                    <p className="text-xs text-gray-500 mb-2 italic">
                      Stack: {proj.technologies.join(" • ")}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Operations / Activities */}
        {operations.length > 0 && (
          <section>
            <h2
              className="text-lg font-bold uppercase mb-4"
              style={{ color: primary }}
            >
              Activities & Operations
            </h2>
            <div className="space-y-3">
              {operations.map((op, i) => (
                <div key={i}>
                  <div className="flex justify-between font-semibold text-gray-800 text-sm">
                    <span>{op.title}</span>
                    <span className="text-xs font-normal text-gray-500">
                      {formatRange(op.startDate, op.endDate)}
                    </span>
                  </div>
                  {op.position && (
                    <div className="text-xs font-bold text-gray-500 mb-1">
                      {op.position}
                    </div>
                  )}
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {op.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <section>
            <h2
              className="text-lg font-bold uppercase mb-4"
              style={{ color: primary }}
            >
              Achievements
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              {achievements.map((ach, i) => (
                <li key={i}>
                  <span className="font-bold">{ach.title}</span>
                  {ach.year && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({ach.year})
                    </span>
                  )}
                  {ach.description && (
                    <span className="block pl-5 text-gray-600 text-xs">
                      {ach.description}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};

export default ModernTemplate;
