import React from "react";

const ModernTemplate = ({ data }) => {
  const info = data.personalInfo;

  return (
    <div className="w-[800px] bg-white shadow-2xl rounded-xl border font-sans flex">
      {/* LEFT SIDEBAR */}
      <div className="w-1/3 bg-[#6A38C2] text-white p-6 rounded-l-xl">
        {/* Avatar */}
        <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white shadow-md">
          <img
            src={info.profilePhoto || "/default-avatar.png"}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name */}
        <h2 className="text-xl font-bold">{info.fullName}</h2>
        <p className="opacity-80 text-sm mt-1">
          {info.title || "Professional"}
        </p>

        {/* Contact */}
        <div className="mt-4 text-sm space-y-1 opacity-90">
          <p>{info.email}</p>
          <p>{info.phone}</p>
          <p>{info.address}</p>
        </div>

        {/* Skills */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {data.skills?.map((s, i) => (
            <span
              key={i}
              className="bg-white text-[#6A38C2] px-2 py-1 rounded text-xs font-semibold"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Languages */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Languages</h3>
        <div className="space-y-1 text-sm opacity-90">
          {data.languages?.map((l, i) => (
            <p key={i}>
              {l.language} – {l.level}
            </p>
          ))}
        </div>

        {/* Links */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Links</h3>
        {data.links?.map((link, i) => (
          <p key={i} className="text-sm underline opacity-90">
            {link.label}: {link.url}
          </p>
        ))}
      </div>

      {/* RIGHT CONTENT */}
      <div className="w-2/3 p-8">
        {/* Summary */}
        <section>
          <h2 className="text-xl font-bold text-gray-900">
            Professional Summary
          </h2>
          <p className="mt-2 text-gray-700 leading-relaxed">{info.summary}</p>
        </section>

        {/* Experience */}
        <section className="mt-6">
          <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
          {data.workExperience?.map((exp, i) => (
            <div key={i} className="mt-3">
              <h3 className="font-semibold text-gray-800">
                {exp.position} – {exp.company}
              </h3>
              <p className="text-sm text-gray-500">
                {exp.startDate} → {exp.endDate}
              </p>
              <p className="text-sm mt-1 text-gray-700">{exp.description}</p>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="mt-6">
          <h2 className="text-xl font-bold text-gray-900">Education</h2>
          {data.education?.map((edu, i) => (
            <div key={i} className="mt-3">
              <h3 className="font-semibold">
                {edu.degree}, {edu.major}
              </h3>
              <p className="text-sm text-gray-500">
                {edu.school} ({edu.startDate} → {edu.endDate})
              </p>
              <p className="text-sm mt-1 text-gray-700">{edu.description}</p>
            </div>
          ))}
        </section>

        {/* Projects */}
        <section className="mt-6">
          <h2 className="text-xl font-bold text-gray-900">Projects</h2>
          {data.projects?.map((p, i) => (
            <div key={i} className="mt-2">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-700">{p.description}</p>
              <p className="text-xs text-gray-500">{p.techStack?.join(", ")}</p>
            </div>
          ))}
        </section>
        <section className="mt-6 mb-4">
          <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
          {data.certifications?.map((c, i) => (
            <p key={i} className="text-sm text-gray-700 mt-1">
              {c.name} – {c.organization} ({c.dateIssued})
            </p>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ModernTemplate;
