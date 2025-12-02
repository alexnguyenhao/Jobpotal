import React from "react";
import { formatRange, formatDate } from "../../../utils/formatDate";

const CreativeTemplate = ({ data }) => {
  const info = data?.personalInfo || {};
  const s = data?.styleConfig || {};

  const skills = data?.skills || [];
  const languages = data?.languages || [];
  const education = data?.education || [];
  const experience = data?.workExperience || [];
  const projects = data?.projects || [];
  const certifications = data?.certifications || [];
  const achievements = data?.achievements || [];
  const operations = data?.operations || [];
  const interests = data?.interests || "";

  const primary = s.primaryColor || "#0ea5e9";

  const wrapperStyle = {
    fontFamily: s.fontFamily || "sans-serif",
    fontSize: s.fontSizeClass || "text-base",
    lineHeight: "1.6",
    color: "#333",
    backgroundColor: s.backgroundColor || "#f8fafc",
  };

  return (
    <div
      className="w-full max-w-[210mm] min-h-[297mm] mx-auto p-6 shadow-xl"
      style={wrapperStyle}
    >
      {/* --- HEADER --- */}
      <div
        className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-6 mb-6 border-l-8 relative overflow-hidden"
        style={{ borderColor: primary }}
      >
        {/* Background deco */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -mr-10 -mt-10"
          style={{ background: primary }}
        ></div>

        <div className="w-28 h-28 rounded-xl overflow-hidden shadow-md flex-shrink-0 border-2 border-gray-100 relative z-10">
          <img
            src={info.profilePhoto || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 leading-none mb-1">
            {info.fullName || "Your Name"}
          </h1>
          <p className="text-xl font-medium mb-3" style={{ color: primary }}>
            {info.position}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 font-medium">
            {info.email && (
              <span className="flex items-center gap-1">✉️ {info.email}</span>
            )}
            {info.phone && (
              <span className="flex items-center gap-1">📱 {info.phone}</span>
            )}
            {info.address && (
              <span className="flex items-center gap-1">📍 {info.address}</span>
            )}
            {info.dateOfBirth && (
              <span className="flex items-center gap-1">
                📅 {formatDate(info.dateOfBirth)}
              </span>
            )}
            {info.gender && (
              <span className="flex items-center gap-1">👤 {info.gender}</span>
            )}
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="grid grid-cols-12 gap-6">
        {/* === LEFT COLUMN (MAIN CONTENT 8/12) === */}
        <div className="col-span-8 flex flex-col gap-6">
          {/* Summary */}
          {info.summary && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 uppercase tracking-wide mb-2 text-sm">
                About Me
              </h3>
              <p className="text-sm text-gray-600 text-justify leading-relaxed whitespace-pre-line">
                {info.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 uppercase tracking-wide mb-4 text-sm flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: primary }}
                ></span>{" "}
                Work Experience
              </h3>
              <div className="space-y-6">
                {experience.map((exp, i) => (
                  <div
                    key={i}
                    className="relative pl-4 border-l-2 border-dashed border-gray-200"
                  >
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300"></div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg text-gray-800 leading-tight">
                        {exp.position}
                      </h4>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-gray-50 text-gray-500 whitespace-nowrap">
                        {formatRange(exp.startDate, exp.endDate)}
                      </span>
                    </div>
                    <p
                      className="text-sm font-semibold mb-2"
                      style={{ color: primary }}
                    >
                      {exp.company}
                    </p>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 uppercase tracking-wide mb-4 text-sm flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: primary }}
                ></span>{" "}
                Projects
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {projects.map((proj, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between font-bold text-gray-800 items-center">
                      <span>{proj.title}</span>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          className="text-xs text-white px-2 py-1 rounded hover:opacity-90"
                          style={{ background: primary }}
                        >
                          View
                        </a>
                      )}
                    </div>
                    {proj.technologies?.length > 0 && (
                      <p className="text-xs text-gray-500 mb-2 mt-1 italic font-medium">
                        Stack: {proj.technologies.join(" • ")}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operations / Activities */}
          {operations.length > 0 && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 uppercase tracking-wide mb-4 text-sm flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: primary }}
                ></span>{" "}
                Activities
              </h3>
              <div className="space-y-4">
                {operations.map((op, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="flex justify-between font-bold text-gray-800 text-sm">
                      <span>{op.title}</span>
                      <span className="text-xs font-normal text-gray-500">
                        {formatRange(op.startDate, op.endDate)}
                      </span>
                    </div>
                    <div className="text-xs font-semibold mb-1 text-gray-500">
                      {op.position}
                    </div>
                    <p className="text-sm text-gray-600">{op.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* === RIGHT COLUMN (SIDEBAR 4/12) === */}
        <div className="col-span-4 flex flex-col gap-6">
          {/* Skills */}
          {skills.length > 0 && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 uppercase tracking-wide mb-3 text-sm">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((sk, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-bold border"
                    style={{
                      color: primary,
                      background: "#fff",
                      borderColor: `${primary}30`,
                    }}
                  >
                    {typeof sk === "object" ? sk.name : sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 uppercase tracking-wide mb-3 text-sm">
                Education
              </h3>
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <div key={i}>
                    <p className="text-xs text-gray-400 font-bold mb-1">
                      {formatRange(edu.startDate, edu.endDate)}
                    </p>
                    <h4 className="font-bold text-gray-800 leading-tight">
                      {edu.school}
                    </h4>
                    <p
                      className="text-sm mt-1 font-semibold"
                      style={{ color: primary }}
                    >
                      {edu.degree}
                    </p>
                    {edu.major && (
                      <p className="text-xs text-gray-500">{edu.major}</p>
                    )}
                    {edu.description && (
                      <p className="text-xs text-gray-400 mt-1 italic">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 uppercase tracking-wide mb-3 text-sm">
                Achievements
              </h3>
              <ul className="space-y-3">
                {achievements.map((ach, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-bold text-gray-800 block">
                      {ach.title}
                    </span>
                    {ach.year && (
                      <span className="text-xs text-gray-400 font-semibold">
                        {ach.year}
                      </span>
                    )}
                    {ach.description && (
                      <p className="text-xs text-gray-600 mt-1">
                        {ach.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 uppercase tracking-wide mb-3 text-sm">
                Certifications
              </h3>
              <ul className="space-y-3">
                {certifications.map((c, i) => (
                  <li key={i} className="text-sm">
                    <div className="font-bold text-gray-700">{c.name}</div>
                    <div className="text-xs text-gray-400">
                      {c.organization}
                    </div>
                    {c.dateIssued && (
                      <div className="text-xs text-gray-400 italic">
                        {formatDate(c.dateIssued)}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages & Interests */}
          {(languages.length > 0 || interests) && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              {languages.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 uppercase tracking-wide mb-2 text-sm">
                    Languages
                  </h3>
                  <ul className="space-y-1">
                    {languages.map((l, i) => (
                      <li
                        key={i}
                        className="flex justify-between text-sm items-center"
                      >
                        <span>{l.language}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                          {l.proficiency}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {interests && (
                <div>
                  <h3 className="font-bold text-gray-900 uppercase tracking-wide mb-2 text-sm">
                    Interests
                  </h3>
                  <p className="text-sm text-gray-600">{interests}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
