import React from "react";
import { formatDate, formatRange } from "../../../utils/formatDate";

const Section = ({ title, children, primaryColor }) => (
  <section className="mt-8">
    <h2
      className="text-2xl font-semibold mb-3 pb-1"
      style={{
        color: primaryColor,
        borderBottom: `2px solid ${primaryColor}`,
      }}
    >
      {title}
    </h2>
    {children}
  </section>
);

const ClassicTemplate = ({ data }) => {
  const info = data.personalInfo;
  const s = data.styleConfig || {};

  const wrapperStyle = {
    backgroundColor: s.backgroundColor,
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

  return (
    <div
      className={`w-[860px] mx-auto leading-relaxed ${s.fontFamily} ${s.fontSizeClass}`}
      style={wrapperStyle}
    >
      <h1 className="text-4xl font-bold">{info.fullName}</h1>
      <p className="text-lg">{info.position}</p>
      <p className="text-sm opacity-70">Email: {info.email}</p>
      <p className="text-sm opacity-70">Phone: {info.phone}</p>
      <p className="text-sm opacity-70">Address: {info.address}</p>

      {info.dateOfBirth && (
        <p className="text-sm opacity-70">
          DOB: {formatDate(info.dateOfBirth)}
        </p>
      )}
      {info.gender && (
        <p className="text-sm opacity-70">Gender: {info.gender}</p>
      )}

      <Section title="Summary" primaryColor={s.primaryColor}>
        <p>{info.summary}</p>
      </Section>

      {data.skills?.length > 0 && (
        <Section title="Skills" primaryColor={s.primaryColor}>
          <div className="flex flex-wrap gap-2">
            {data.skills?.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded text-sm"
                style={{
                  backgroundColor: s.primaryColor + "22",
                  color: s.textColor,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}

      {data.workExperience?.length > 0 && (
        <Section title="Work Experience" primaryColor={s.primaryColor}>
          {data.workExperience?.map((exp, i) => (
            <div key={i} className="mt-4">
              <h3 className="font-semibold text-lg">
                {exp.position} – {exp.company}
              </h3>
              <p className="text-sm opacity-70">
                {formatRange(exp.startDate, exp.endDate)}
              </p>
              <p className="mt-1">{exp.description}</p>
            </div>
          ))}
        </Section>
      )}

      {data.education?.length > 0 && (
        <Section title="Education" primaryColor={s.primaryColor}>
          {data.education?.map((edu, i) => (
            <div key={i} className="mt-4">
              <h3 className="font-semibold text-lg">
                {edu.degree}, {edu.major}
              </h3>
              <p className="text-sm opacity-70">
                {edu.school} ({formatRange(edu.startDate, edu.endDate)})
              </p>
              <p className="mt-1">{edu.description}</p>
            </div>
          ))}
        </Section>
      )}

      {data.certifications?.length > 0 && (
        <Section title="Certifications" primaryColor={s.primaryColor}>
          {data.certifications.map((c, i) => (
            <p key={i} className="mt-2">
              {c.name} – {c.organization} ({formatDate(c.dateIssued)})
            </p>
          ))}
        </Section>
      )}

      {data.languages?.length > 0 && (
        <Section title="Languages" primaryColor={s.primaryColor}>
          {data.languages.map((l, i) => (
            <p key={i} className="mt-1">
              {l.language} – {l.proficiency}
            </p>
          ))}
        </Section>
      )}

      {data.achievements?.length > 0 && (
        <Section title="Achievements" primaryColor={s.primaryColor}>
          {data.achievements.map((a, i) => (
            <div key={i} className="mt-2">
              <p className="font-semibold">
                {a.title} - {a.year}
              </p>
              <p className="text-sm">{a.description}</p>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
};

export default ClassicTemplate;
