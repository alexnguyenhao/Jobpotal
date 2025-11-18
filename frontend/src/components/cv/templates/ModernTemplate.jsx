import React from "react";
import { formatDate } from "../../../utils/formatDate";

const ModernTemplate = ({ data }) => {
  // Fallback dữ liệu nếu undefined
  const info = data?.personalInfo || {};
  const s = data?.styleConfig || {};

  const wrapperStyle = {
    backgroundColor: s.backgroundColor || "#ffffff",
    color: s.textColor || "#333",
    borderRadius: s.borderRadius || 0,
    overflow: "hidden",
    boxShadow:
      s.shadowLevel === 0
        ? "none"
        : s.shadowLevel === 1
        ? "0 2px 6px rgba(0,0,0,0.1)"
        : s.shadowLevel === 2
        ? "0 4px 12px rgba(0,0,0,0.15)"
        : "0 8px 25px rgba(0,0,0,0.25)",
  };

  // Padding config
  const spacing =
    s.spacing === "tight" ? "p-6" : s.spacing === "wide" ? "p-12" : "p-8";

  return (
    <div
      // SỬA: Dùng max-w-[210mm] và min-h-[297mm] để chuẩn khổ A4
      className={`w-full max-w-[210mm] min-h-[297mm] mx-auto flex ${s.fontFamily} ${s.fontSizeClass}`}
      style={wrapperStyle}
    >
      {/* LEFT SIDEBAR */}
      <aside
        className={`w-1/3 text-white ${spacing} flex flex-col`}
        style={{
          background: `linear-gradient(180deg, ${s.primaryColor || "#333"}, ${
            (s.primaryColor || "#333") + "AA"
          })`,
        }}
      >
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
          <img
            src={info.profilePhoto || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-2xl font-bold mt-6 text-center leading-tight">
          {info.fullName}
        </h1>

        {info.position && (
          <p className="text-center text-sm opacity-90 mt-2 font-medium">
            {info.position}
          </p>
        )}

        <div className="mt-8 text-sm opacity-95 space-y-3">
          {info.email && (
            <p className="break-words">
              <b>Email:</b> <br /> {info.email}
            </p>
          )}
          {info.phone && (
            <p>
              <b>Phone:</b> <br /> {info.phone}
            </p>
          )}
          {info.dateOfBirth && (
            <p>
              <b>DOB:</b> <br /> {formatDate(info.dateOfBirth)}
            </p>
          )}
          {info.address && (
            <p>
              <b>Address:</b> <br /> {info.address}
            </p>
          )}
        </div>

        {/* Skills in Sidebar */}
        {data.skills?.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold border-b border-white/30 pb-1 mb-3">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "#fff",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.languages?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold border-b border-white/30 pb-1 mb-3">
              Languages
            </h3>
            <ul className="space-y-1 text-sm">
              {data.languages.map((l, i) => (
                <li key={i} className="flex justify-between">
                  <span>{l.language}</span>
                  <span className="opacity-70 italic">{l.proficiency}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* RIGHT MAIN CONTENT */}
      <main className={`w-2/3 ${spacing} bg-white`}>
        {/* SUMMARY */}
        {info.summary && (
          <section className="mb-8">
            <h2
              className="text-xl font-bold mb-3 uppercase tracking-wide"
              style={{ color: s.primaryColor }}
            >
              Profile
            </h2>
            <p className="opacity-80 text-justify leading-relaxed">
              {info.summary}
            </p>
          </section>
        )}

        {/* EXPERIENCE */}
        {data.workExperience?.length > 0 && (
          <section className="mb-8">
            <h2
              className="text-xl font-bold mb-4 uppercase tracking-wide border-b-2 pb-1"
              style={{
                color: s.primaryColor,
                borderColor: s.primaryColor + "33",
              }}
            >
              Work Experience
            </h2>

            <div className="space-y-5">
              {data.workExperience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-lg">{exp.position}</h3>
                    <span className="text-sm opacity-60 whitespace-nowrap ml-2">
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold opacity-80 mb-1">
                    {exp.company}
                  </p>
                  <p className="text-sm opacity-80 whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {data.education?.length > 0 && (
          <section className="mb-8">
            <h2
              className="text-xl font-bold mb-4 uppercase tracking-wide border-b-2 pb-1"
              style={{
                color: s.primaryColor,
                borderColor: s.primaryColor + "33",
              }}
            >
              Education
            </h2>
            {data.education.map((edu, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-base">{edu.school}</h3>
                  <span className="text-sm opacity-60">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <p className="text-sm font-medium">
                  {edu.degree} {edu.major && `- ${edu.major}`}
                </p>
                <p className="text-sm opacity-80 mt-1">{edu.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* PROJECTS */}
        {data.projects?.length > 0 && (
          <section className="mb-8">
            <h2
              className="text-xl font-bold mb-4 uppercase tracking-wide border-b-2 pb-1"
              style={{
                color: s.primaryColor,
                borderColor: s.primaryColor + "33",
              }}
            >
              Projects
            </h2>
            {data.projects.map((proj, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between">
                  <h3 className="font-bold">{proj.name}</h3>
                  {proj.link && (
                    <a
                      href={proj.link}
                      className="text-xs text-blue-600 underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Link
                    </a>
                  )}
                </div>
                <p className="text-xs italic opacity-70 mb-1">
                  {proj.technologies}
                </p>
                <p className="text-sm opacity-80">{proj.description}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default ModernTemplate;
