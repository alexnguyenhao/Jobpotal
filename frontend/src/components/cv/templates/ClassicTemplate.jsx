import React from "react";
import { formatDate, formatRange } from "../../../utils/formatDate";

const Section = ({ title, children, primaryColor }) => (
  <section className="mt-6 mb-2">
    <h2
      className="text-lg font-bold uppercase mb-3 pb-1 tracking-wider"
      style={{
        color: primaryColor,
        borderBottom: `1px solid ${primaryColor}`,
      }}
    >
      {title}
    </h2>
    {children}
  </section>
);

const ClassicTemplate = ({ data }) => {
  const info = data?.personalInfo || {};
  const s = data?.styleConfig || {};

  const wrapperStyle = {
    backgroundColor: s.backgroundColor || "#fff",
    color: s.textColor || "#000",
    borderRadius: s.borderRadius || 0,
    padding:
      s.spacing === "tight" ? "1.5rem" : s.spacing === "wide" ? "4rem" : "3rem",
    lineHeight: "1.6",
    // ❌ ĐÃ XÓA: fontFamily: ... (Để class tailwind tự xử lý)
  };

  return (
    <div
      // ✅ FIX: s.fontFamily được đưa vào className để Tailwind xử lý (font-sans, font-serif...)
      className={`w-full max-w-[210mm] min-h-[297mm] mx-auto ${
        s.fontFamily || "font-sans"
      } ${s.fontSizeClass}`}
      style={wrapperStyle}
    >
      {/* HEADER CENTRED */}
      <header className="text-center border-b-2 border-gray-800 pb-6 mb-6">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">
          {info.fullName}
        </h1>
        <p className="text-xl font-medium italic mb-3">{info.position}</p>

        <div className="flex flex-wrap justify-center gap-4 text-sm opacity-80">
          {info.email && <span>{info.email}</span>}
          {info.phone && <span>• {info.phone}</span>}
          {info.address && <span>• {info.address}</span>}
          {info.dateOfBirth && <span>• {formatDate(info.dateOfBirth)}</span>}
        </div>
      </header>

      {/* SUMMARY */}
      {info.summary && (
        <div className="mb-6 text-justify">
          <p>{info.summary}</p>
        </div>
      )}

      {/* WORK EXPERIENCE */}
      {data.workExperience?.length > 0 && (
        <Section title="Professional Experience" primaryColor={s.primaryColor}>
          {data.workExperience.map((exp, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between items-baseline font-bold">
                <h3 className="text-lg">{exp.company}</h3>
                <span className="text-sm italic font-normal">
                  {formatRange(exp.startDate, exp.endDate)}
                </span>
              </div>
              <p className="font-semibold italic mb-1">{exp.position}</p>
              <p className="text-sm text-justify whitespace-pre-line">
                {exp.description}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* EDUCATION */}
      {data.education?.length > 0 && (
        <Section title="Education" primaryColor={s.primaryColor}>
          {data.education.map((edu, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline font-bold">
                <h3>{edu.school}</h3>
                <span className="text-sm italic font-normal">
                  {formatRange(edu.startDate, edu.endDate)}
                </span>
              </div>
              <p>
                {edu.degree} {edu.major && `in ${edu.major}`}
              </p>
              {edu.description && (
                <p className="text-sm mt-1">{edu.description}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* SKILLS */}
      {data.skills?.length > 0 && (
        <Section title="Skills" primaryColor={s.primaryColor}>
          <div className="text-sm">
            <p>{data.skills.join(" • ")}</p>
          </div>
        </Section>
      )}

      {/* PROJECTS */}
      {data.projects?.length > 0 && (
        <Section title="Projects" primaryColor={s.primaryColor}>
          {data.projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <span className="font-bold">{proj.name}</span>
              {proj.technologies && (
                <span className="italic text-sm"> ({proj.technologies})</span>
              )}
              {proj.link && (
                <span className="text-xs ml-2 text-blue-600">
                  [{proj.link}]
                </span>
              )}
              <p className="text-sm mt-1">{proj.description}</p>
            </div>
          ))}
        </Section>
      )}

      {/* LANGUAGES & CERTIFICATIONS GRID */}
      <div className="grid grid-cols-2 gap-8">
        {data.languages?.length > 0 && (
          <Section title="Languages" primaryColor={s.primaryColor}>
            {data.languages.map((lang, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="font-semibold">{lang.language}</span>
                <span>{lang.proficiency}</span>
              </div>
            ))}
          </Section>
        )}

        {data.certifications?.length > 0 && (
          <Section title="Certifications" primaryColor={s.primaryColor}>
            {data.certifications.map((cert, i) => (
              <div key={i} className="mb-1 text-sm">
                <span className="font-semibold">{cert.name}</span>
                <span className="text-xs block opacity-70">
                  {cert.organization}
                </span>
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
};

export default ClassicTemplate;
