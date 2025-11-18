import React from "react";
import { formatDate, formatRange } from "../../../utils/formatDate";

const CreativeTemplate = ({ data }) => {
  const info = data?.personalInfo || {};
  const s = data?.styleConfig || {};

  // Màu nền gradient cho wrapper
  const wrapperStyle = {
    background: `linear-gradient(135deg, ${s.primaryColor || "#4D6CFF"}, ${
      (s.primaryColor || "#4D6CFF") + "AA"
    })`,
    color: s.textColor || "#333",
    borderRadius: s.borderRadius || 0,
    padding:
      s.spacing === "tight" ? "1.5rem" : s.spacing === "wide" ? "4rem" : "3rem",
    minHeight: "297mm", // Chuẩn A4
  };

  // Màu nền cho các Card con (màu nền chính + độ trong suốt)
  const cardBg = (s.backgroundColor || "#ffffff") + "F2"; // F2 = 95% opacity

  return (
    <div
      className={`w-full max-w-[210mm] mx-auto ${s.fontFamily} ${s.fontSizeClass}`}
      style={wrapperStyle}
    >
      {/* HEADER CARD */}
      <div
        className="flex items-center gap-6 p-6 rounded-xl shadow-md"
        style={{ backgroundColor: cardBg }}
      >
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0">
          <img
            src={info.profilePhoto || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <h1
            className="text-4xl font-extrabold mb-1"
            style={{ color: s.primaryColor }}
          >
            {info.fullName}
          </h1>
          <p className="text-xl font-medium opacity-80 mb-3">{info.position}</p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm opacity-70">
            {info.email && <span>📧 {info.email}</span>}
            {info.phone && <span>📱 {info.phone}</span>}
            {info.address && <span>📍 {info.address}</span>}
          </div>
        </div>
      </div>

      {/* BODY CONTENT - 2 COLUMNS GRID */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        {/* LEFT COLUMN (Small) */}
        <div className="col-span-1 space-y-6">
          {/* SKILLS */}
          {data.skills?.length > 0 && (
            <div
              className="p-5 rounded-xl shadow-sm"
              style={{ backgroundColor: cardBg }}
            >
              <h3 className="font-bold mb-3 border-b pb-1">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((sk, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: s.primaryColor + "20", // 20 = low opacity
                      color: s.primaryColor,
                    }}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {data.languages?.length > 0 && (
            <div
              className="p-5 rounded-xl shadow-sm"
              style={{ backgroundColor: cardBg }}
            >
              <h3 className="font-bold mb-3 border-b pb-1">Languages</h3>
              <ul className="text-sm space-y-2">
                {data.languages.map((l, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{l.language}</span>
                    <span className="opacity-60 text-xs">{l.proficiency}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {data.certifications?.length > 0 && (
            <div
              className="p-5 rounded-xl shadow-sm"
              style={{ backgroundColor: cardBg }}
            >
              <h3 className="font-bold mb-3 border-b pb-1">Certifications</h3>
              <div className="space-y-3 text-sm">
                {data.certifications.map((cert, i) => (
                  <div key={i}>
                    <p className="font-semibold">{cert.name}</p>
                    <p className="text-xs opacity-70">{cert.organization}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (Large) */}
        <div className="col-span-2 space-y-6">
          {/* SUMMARY */}
          {info.summary && (
            <div
              className="p-6 rounded-xl shadow-sm"
              style={{ backgroundColor: cardBg }}
            >
              <h3 className="font-bold text-lg mb-2 uppercase tracking-wide opacity-80">
                Summary
              </h3>
              <p className="text-sm leading-relaxed">{info.summary}</p>
            </div>
          )}

          {/* EXPERIENCE - SỬA LỖI BIẾN */}
          {data.workExperience?.length > 0 && (
            <div
              className="p-6 rounded-xl shadow-sm"
              style={{ backgroundColor: cardBg }}
            >
              <h3 className="font-bold text-lg mb-4 uppercase tracking-wide opacity-80 border-b pb-2">
                Work Experience
              </h3>
              <div className="space-y-6">
                {data.workExperience.map((exp, i) => (
                  <div
                    key={i}
                    className="relative pl-4 border-l-2 border-gray-300"
                  >
                    <h4 className="font-bold text-lg">{exp.position}</h4>
                    <p className="text-sm font-semibold opacity-70">
                      {exp.company}
                    </p>
                    <p className="text-xs opacity-50 mb-2">
                      {formatRange(exp.startDate, exp.endDate)}
                    </p>
                    <p className="text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {data.education?.length > 0 && (
            <div
              className="p-6 rounded-xl shadow-sm"
              style={{ backgroundColor: cardBg }}
            >
              <h3 className="font-bold text-lg mb-4 uppercase tracking-wide opacity-80 border-b pb-2">
                Education
              </h3>
              <div className="space-y-4">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between">
                      <h4 className="font-bold">{edu.school}</h4>
                      <span className="text-xs opacity-60">
                        {formatRange(edu.startDate, edu.endDate)}
                      </span>
                    </div>
                    <p className="text-sm font-medium">
                      {edu.degree}, {edu.major}
                    </p>
                    <p className="text-sm opacity-80 mt-1">{edu.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* PROJECTS */}
          {data.projects?.length > 0 && (
            <div
              className="p-6 rounded-xl shadow-sm"
              style={{ backgroundColor: cardBg }}
            >
              <h3 className="font-bold text-lg mb-4 uppercase tracking-wide opacity-80 border-b pb-2">
                Projects
              </h3>
              {data.projects.map((proj, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <h4 className="font-bold">{proj.name}</h4>
                  <p className="text-xs italic opacity-60">
                    {proj.technologies}
                  </p>
                  <p className="text-sm mt-1">{proj.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
