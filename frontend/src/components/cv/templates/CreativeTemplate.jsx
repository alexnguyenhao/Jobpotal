import React from "react";
import { formatDate, formatRange } from "../../../utils/formatDate";

const CreativeTemplate = ({ data }) => {
  const info = data.personalInfo;
  const s = data.styleConfig || {};

  const wrapperStyle = {
    background: `linear-gradient(135deg, ${s.primaryColor}, ${
      s.primaryColor + "AA"
    })`,
    color: s.textColor,
    borderRadius: s.borderRadius,
    padding:
      s.spacing === "tight" ? "1rem" : s.spacing === "wide" ? "3rem" : "2rem",
    boxShadow:
      s.shadowLevel === 0
        ? "none"
        : s.shadowLevel === 1
        ? "0 2px 6px rgba(0,0,0,0.1)"
        : s.shadowLevel === 2
        ? "0 4px 12px rgba(0,0,0,0.15)"
        : "0 8px 25px rgba(0,0,0,0.25)",
  };

  const cardBg = s.backgroundColor + "cc";

  return (
    <div className={`${s.fontFamily} ${s.fontSizeClass}`} style={wrapperStyle}>
      {/* HEADER */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src={info.profilePhoto || "/default-avatar.png"}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-4xl font-extrabold">{info.fullName}</h1>
          {info.position && (
            <p className="text-lg mt-1 opacity-90">{info.position}</p>
          )}
          <p className="opacity-90 text-sm mt-2">
            {info.email} • {info.phone}
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <section className="mt-8">
        <h2
          className="text-2xl font-bold mb-2"
          style={{ borderBottom: `2px solid ${s.textColor}` }}
        >
          Summary
        </h2>
        <p>{info.summary}</p>
      </section>

      {/* SKILLS */}
      <section className="mt-8">
        <h2
          className="text-2xl font-bold mb-2"
          style={{ borderBottom: `2px solid ${s.textColor}` }}
        >
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((sk, i) => (
            <span
              key={i}
              className="px-4 py-1 rounded-full text-sm"
              style={{
                backgroundColor: s.backgroundColor + "88",
                color: s.textColor,
              }}
            >
              {sk}
            </span>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="mt-8">
        <h2
          className="text-2xl font-bold mb-2"
          style={{ borderBottom: `2px solid ${s.textColor}` }}
        >
          Work Experience
        </h2>
        {data.workExperience.map((exp, i) => (
          <div
            key={i}
            className="mt-4 p-4 rounded-lg"
            style={{ backgroundColor: cardBg }}
          >
            <h3 className="font-bold">
              {exp.position} – {exp.company}
            </h3>
            <p className="opacity-80 text-sm">
              {formatRange(exp.startDate, exp.endDate)}
            </p>
            <p className="mt-2">{exp.description}</p>
          </div>
        ))}
      </section>

      {/* EDUCATION */}
      <section className="mt-8">
        <h2
          className="text-2xl font-bold mb-2"
          style={{ borderBottom: `2px solid ${s.textColor}` }}
        >
          Education
        </h2>
        {data.education.map((edu, i) => (
          <div
            key={i}
            className="mt-4 p-4 rounded-lg"
            style={{ backgroundColor: cardBg }}
          >
            <h3 className="font-bold">
              {edu.degree}, {edu.major}
            </h3>
            <p className="opacity-80 text-sm">
              {edu.school} ({formatRange(edu.startDate, edu.endDate)})
            </p>
            <p className="mt-2">{edu.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default CreativeTemplate;
