import React from "react";

const CreativeTemplate = ({ data }) => {
  const info = data.personalInfo;

  return (
    <div className="w-[800px] bg-gradient-to-br from-[#9b6aff] to-[#4a6cff] text-white p-10 rounded-2xl shadow-2xl font-sans">
      {/* HEADER */}
      <div className="flex items-center gap-5">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
          <img
            src={info.profilePhoto || "/default-avatar.png"}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold">{info.fullName}</h1>
          <p className="opacity-90 mt-1">
            {info.email} • {info.phone}
          </p>
        </div>
      </div>

      {/* BIO */}
      <section className="mt-6">
        <h2 className="text-2xl font-bold">Bio</h2>
        <p className="mt-2 opacity-90 leading-relaxed">{info.summary}</p>
      </section>

      {/* SKILLS */}
      <section className="mt-6">
        <h2 className="text-2xl font-bold">Skills</h2>
        <div className="flex flex-wrap gap-3 mt-2">
          {data.skills?.map((s, i) => (
            <span
              key={i}
              className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm shadow-lg font-medium"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold">Work Experience</h2>
        {data.workExperience?.map((exp, i) => (
          <div key={i} className="mt-4 bg-white/15 p-4 rounded-xl shadow">
            <h3 className="font-bold">
              {exp.position} – {exp.company}
            </h3>
            <p className="text-sm opacity-80">
              {exp.startDate} → {exp.endDate}
            </p>
            <p className="mt-1 opacity-90">{exp.description}</p>
          </div>
        ))}
      </section>

      {/* EDUCATION */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold">Education</h2>
        {data.education?.map((edu, i) => (
          <div key={i} className="mt-4 bg-white/15 p-4 rounded-xl shadow">
            <h3 className="font-bold">
              {edu.degree}, {edu.major}
            </h3>
            <p className="text-sm opacity-80">
              {edu.school} ({edu.startDate} → {edu.endDate})
            </p>
            <p className="mt-1 opacity-90">{edu.description}</p>
          </div>
        ))}
      </section>

      {/* PROJECTS */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold">Projects</h2>
        {data.projects?.map((p, i) => (
          <div key={i} className="mt-3 bg-white/20 p-3 rounded-lg shadow">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="opacity-90">{p.description}</p>
            <p className="text-sm opacity-80 mt-1">{p.techStack?.join(", ")}</p>
          </div>
        ))}
      </section>

      {/* CERTIFICATIONS */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold">Certifications</h2>
        {data.certifications?.map((c, i) => (
          <p key={i} className="opacity-90 mt-1">
            {c.name} – {c.organization} ({c.dateIssued})
          </p>
        ))}
      </section>
    </div>
  );
};

export default CreativeTemplate;
