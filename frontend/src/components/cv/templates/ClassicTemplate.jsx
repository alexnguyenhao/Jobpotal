import React from "react";

const ClassicTemplate = ({ data }) => {
  const info = data.personalInfo;

  return (
    <div className="w-[800px] bg-[#faf7f2] border border-gray-300 rounded-xl p-10 font-serif text-gray-900">
      {/* Header */}
      <h1 className="text-4xl font-bold">{info.fullName}</h1>
      <p className="mt-2 italic text-gray-700">
        {info.email} • {info.phone} • {info.address}
      </p>

      <hr className="my-6 border-gray-400" />

      {/* Summary */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Professional Summary</h2>
        <p className="leading-relaxed">{info.summary}</p>
      </section>

      {/* Experience */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold">Work Experience</h2>
        {data.workExperience?.map((exp, i) => (
          <div key={i} className="mt-4">
            <h3 className="font-bold">
              {exp.position} – {exp.company}
            </h3>
            <p className="text-sm text-gray-600">
              {exp.startDate} → {exp.endDate}
            </p>
            <p className="mt-1">{exp.description}</p>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold">Education</h2>
        {data.education?.map((edu, i) => (
          <div key={i} className="mt-4">
            <h3 className="font-bold">
              {edu.degree}, {edu.major}
            </h3>
            <p className="text-sm text-gray-600">
              {edu.school} • {edu.startDate} → {edu.endDate}
            </p>
            <p>{edu.description}</p>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold">Skills</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {data.skills?.map((s, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-gray-200 rounded text-sm font-medium"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold">Certifications</h2>
        {data.certifications?.map((c, i) => (
          <p key={i} className="mt-1">
            {c.name} – {c.organization} ({c.dateIssued})
          </p>
        ))}
      </section>

      {/* References */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold">References</h2>
        {data.references?.map((r, i) => (
          <p key={i} className="mt-1">
            {r.name} – {r.position} ({r.company})
          </p>
        ))}
      </section>
    </div>
  );
};

export default ClassicTemplate;
