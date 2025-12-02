import React from "react";
import { formatRange, formatDate } from "../../../utils/formatDate";

const Section = ({ title, children, primaryColor }) => (
  <section className="mb-6 w-full">
    <h2
      className="text-lg font-bold uppercase mb-3 border-b pb-1"
      style={{
        color: primaryColor,
        borderColor: "#ccc",
        letterSpacing: "0.5px",
      }}
    >
      {title}
    </h2>
    <div className="pl-1">{children}</div>
  </section>
);

const ClassicTemplate = ({ data }) => {
  const info = data?.personalInfo || {};
  const s = data?.styleConfig || {};

  const skills = data?.skills || [];
  const education = data?.education || [];
  const experience = data?.workExperience || [];
  const projects = data?.projects || [];
  const languages = data?.languages || [];
  const certifications = data?.certifications || [];
  const achievements = data?.achievements || [];
  const operations = data?.operations || [];
  const interests = data?.interests || "";

  const primary = s.primaryColor || "#333";
  const wrapperStyle = {
    fontFamily: s.fontFamily || "Times New Roman, serif",
    fontSize: s.fontSizeClass || "text-base",
    lineHeight: "1.6",
    color: s.textColor || "#000",
    backgroundColor: s.backgroundColor || "#fff",
  };

  return (
    <div
      className="w-full max-w-[210mm] min-h-[297mm] mx-auto p-10 shadow-lg"
      style={wrapperStyle}
    >
      {/* HEADER */}
      <header className="text-center mb-6">
        <h1
          className="text-3xl font-bold uppercase mb-2 tracking-wide"
          style={{ color: primary }}
        >
          {info.fullName || "Your Name"}
        </h1>
        <p className="text-xl font-medium italic text-gray-600 mb-2">
          {info.position}
        </p>

        {/* Contact info grid */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
          {info.email && <span>{info.email}</span>}
          {info.phone && <span>• {info.phone}</span>}
          {info.address && <span>• {info.address}</span>}
          {info.dateOfBirth && <span>• {formatDate(info.dateOfBirth)}</span>}
          {info.gender && <span>• {info.gender}</span>}
        </div>
      </header>

      {/* SUMMARY */}
      {info.summary && (
        <Section title="Professional Summary" primaryColor={primary}>
          <p className="text-justify whitespace-pre-line">{info.summary}</p>
        </Section>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <Section title="Education" primaryColor={primary}>
          {education.map((edu, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-lg">{edu.school}</h3>
                <span className="text-sm italic font-medium">
                  {formatRange(edu.startDate, edu.endDate)}
                </span>
              </div>
              <div className="font-semibold text-gray-800">
                {edu.degree} {edu.major && `in ${edu.major}`}
              </div>
              {edu.description && (
                <p className="text-sm mt-1 ml-4 list-disc display-list-item">
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* WORK EXPERIENCE */}
      {experience.length > 0 && (
        <Section title="Work Experience" primaryColor={primary}>
          {experience.map((exp, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-lg">{exp.company}</h3>
                <span className="text-sm italic font-medium">
                  {formatRange(exp.startDate, exp.endDate)}
                </span>
              </div>
              <div className="font-bold italic mb-1" style={{ color: primary }}>
                {exp.position}
              </div>
              <p className="text-sm whitespace-pre-line text-justify">
                {exp.description}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <Section title="Projects" primaryColor={primary}>
          {projects.map((proj, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-lg">{proj.title}</h3>
                {proj.link && (
                  <span className="text-xs text-blue-800 underline">
                    {proj.link}
                  </span>
                )}
              </div>
              {proj.technologies?.length > 0 && (
                <p className="text-sm italic text-gray-600 mb-1">
                  Stack: {proj.technologies.join(", ")}
                </p>
              )}
              <p className="text-sm whitespace-pre-line">{proj.description}</p>
            </div>
          ))}
        </Section>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <Section title="Skills" primaryColor={primary}>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {skills.map((sk, i) => {
              const name = typeof sk === "object" ? sk.name : sk;
              const level = typeof sk === "object" ? sk.level : "";
              return (
                <span key={i} className="font-medium">
                  • {name}{" "}
                  {level && (
                    <span className="font-normal italic text-xs text-gray-500">
                      ({level})
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </Section>
      )}

      {/* OPERATIONS / ACTIVITIES */}
      {operations.length > 0 && (
        <Section title="Activities & Operations" primaryColor={primary}>
          {operations.map((op, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between font-bold text-sm">
                <span>{op.title}</span>
                <span className="font-normal italic">
                  {formatRange(op.startDate, op.endDate)}
                </span>
              </div>
              {op.position && (
                <div className="text-sm italic mb-1">{op.position}</div>
              )}
              <p className="text-sm whitespace-pre-line">{op.description}</p>
            </div>
          ))}
        </Section>
      )}

      {/* ACHIEVEMENTS */}
      {achievements.length > 0 && (
        <Section title="Achievements" primaryColor={primary}>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {achievements.map((ach, i) => (
              <li key={i}>
                <span className="font-bold">{ach.title}</span>
                {ach.year && <span> ({ach.year})</span>}
                {ach.description && <span>: {ach.description}</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* CERTIFICATIONS & LANGUAGES & INTERESTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {certifications.length > 0 && (
          <div>
            <h3
              className="font-bold uppercase mb-2 text-sm border-b"
              style={{ borderColor: primary }}
            >
              Certifications
            </h3>
            <ul className="text-sm space-y-2">
              {certifications.map((c, i) => (
                <li key={i}>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs">
                    {c.organization}{" "}
                    {c.dateIssued && `(${formatDate(c.dateIssued)})`}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(languages.length > 0 || interests) && (
          <div>
            {languages.length > 0 && (
              <div className="mb-4">
                <h3
                  className="font-bold uppercase mb-2 text-sm border-b"
                  style={{ borderColor: primary }}
                >
                  Languages
                </h3>
                <ul className="text-sm">
                  {languages.map((l, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{l.language}</span>
                      <span className="italic text-gray-600">
                        {l.proficiency}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {interests && (
              <div>
                <h3
                  className="font-bold uppercase mb-2 text-sm border-b"
                  style={{ borderColor: primary }}
                >
                  Interests
                </h3>
                <p className="text-sm whitespace-pre-line">{interests}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassicTemplate;
