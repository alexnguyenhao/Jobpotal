import React from "react";
import { formatDate } from "../../../utils/formatDate";

const ModernTemplate = ({ data }) => {
  const info = data.personalInfo;
  const s = data.styleConfig || {};

  const wrapperStyle = {
    backgroundColor: s.backgroundColor,
    color: s.textColor,
    borderRadius: s.borderRadius,
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

  const spacing =
    s.spacing === "tight" ? "p-6" : s.spacing === "wide" ? "p-12" : "p-8";

  return (
    <div
      className={`w-[860px] mx-auto flex ${s.fontFamily} ${s.fontSizeClass}`}
      style={wrapperStyle}
    >
      {/* LEFT SIDEBAR */}
      <aside
        className={`w-1/3 text-white ${spacing}`}
        style={{
          background: `linear-gradient(180deg, ${s.primaryColor}, ${
            s.primaryColor + "AA"
          })`,
        }}
      >
        <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src={info.profilePhoto || "/default-avatar.png"}
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-2xl font-bold mt-6 text-center leading-tight">
          {info.fullName}
        </h1>

        {info.position && (
          <p className="text-center text-sm opacity-90 mt-1">{info.position}</p>
        )}

        <div className="mt-8 text-sm opacity-90 space-y-2">
          <p>
            <b>Email:</b> {info.email}
          </p>
          <p>
            <b>Phone:</b> {info.phone}
          </p>
          {info.dateOfBirth && (
            <p>
              <b>DOB:</b> {formatDate(info.dateOfBirth)}
            </p>
          )}
          {info.gender && (
            <p>
              <b>Gender:</b> {info.gender}
            </p>
          )}
          <p>
            <b>Address:</b> {info.address}
          </p>
        </div>

        <h3 className="text-lg font-semibold mt-12">Skills</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {data.skills?.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs"
              style={{
                backgroundColor: "rgba(255,255,255,0.9)",
                color: s.primaryColor,
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        {data.languages?.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mt-10">Languages</h3>
            <ul className="mt-2 space-y-1 text-sm opacity-90">
              {data.languages.map((l, i) => (
                <li key={i}>
                  {l.language} – {l.proficiency}
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>

      {/* RIGHT MAIN CONTENT */}
      <main className={`w-2/3 ${spacing}`}>
        {/* SUMMARY */}
        <section>
          <h2
            className="text-2xl font-bold mb-2 pb-1"
            style={{
              color: s.primaryColor,
              borderBottom: `2px solid ${s.primaryColor}`,
            }}
          >
            Professional Summary
          </h2>
          <p className="opacity-90">{info.summary}</p>
        </section>

        {/* EXPERIENCE */}
        <section className="mt-10">
          <h2
            className="text-2xl font-bold mb-3 pb-1"
            style={{
              color: s.primaryColor,
              borderBottom: `2px solid ${s.primaryColor}`,
            }}
          >
            Work Experience
          </h2>

          <div className="space-y-6">
            {data.workExperience?.map((exp, i) => (
              <div key={i}>
                <h3 className="font-semibold text-lg">
                  {exp.position} – {exp.company}
                </h3>
                <p className="text-sm opacity-70">
                  {formatDate(exp.startDate)} → {formatDate(exp.endDate)}
                </p>
                <p className="mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* EDUCATION */}
        <section className="mt-10">
          <h2
            className="text-2xl font-bold mb-3 pb-1"
            style={{
              color: s.primaryColor,
              borderBottom: `2px solid ${s.primaryColor}`,
            }}
          >
            Education
          </h2>

          {data.education?.map((edu, i) => (
            <div key={i} className="mt-4">
              <h3 className="font-semibold text-base">
                {edu.degree}, {edu.major}
              </h3>
              <p className="text-sm opacity-70">
                {edu.school} ({formatDate(edu.startDate)} →{" "}
                {formatDate(edu.endDate)})
              </p>
              <p className="mt-2">{edu.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default ModernTemplate;
