import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import {
  Mail,
  Phone,
  MapPin,
  User2,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Star,
  FolderGit2,
} from "lucide-react";

const Section = ({ title, icon, children }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-[#6A38C2] flex items-center gap-2 mb-3">
      {icon} {title}
    </h2>
    {children}
  </div>
);

const Empty = ({ text }) => (
  <p className="text-gray-400 text-sm italic">{text}</p>
);

const formatDate = (str) => {
  if (!str) return "";
  const d = new Date(str);
  return `${d.getMonth() + 1}/${d.getFullYear()}`;
};

const RecruiterResume = () => {
  const { userId } = useParams();
  const { state } = useLocation();

  const [user, setUser] = useState(state?.applicant || null);
  const [loading, setLoading] = useState(!state?.applicant);

  // 🔥 Nếu recruiter vào trực tiếp URL → fetch user
  useEffect(() => {
    if (state?.applicant) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${USER_API_END_POINT}/user/${userId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, state]);

  if (loading) {
    return (
      <div className="text-center p-10 text-gray-500">
        Loading applicant resume...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-10 text-gray-500">Applicant not found.</div>
    );
  }

  const p = user.profile || {};

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-10 my-10 border border-gray-200 font-sans text-gray-900 leading-relaxed">
      <header className="border-b pb-6 mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-[#6A38C2]">
          {user.fullName}
        </h1>

        <p className="text-lg text-gray-700 mt-1">{p.title}</p>

        <div className="flex flex-wrap justify-center gap-6 mt-5 text-sm text-gray-700">
          {user.email && (
            <span className="flex items-center gap-1">
              <Mail size={16} className="text-[#6A38C2]" />
              {user.email}
            </span>
          )}

          {user.phoneNumber && (
            <span className="flex items-center gap-1">
              <Phone size={16} className="text-[#6A38C2]" />
              {user.phoneNumber}
            </span>
          )}

          {user.address && (
            <span className="flex items-center gap-1">
              <MapPin size={16} className="text-[#6A38C2]" />
              {user.address}
            </span>
          )}
        </div>
      </header>

      <Section title="Skills" icon={<Star />}>
        {p.skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {p.skills.map((s, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-[#6A38C2]/10 text-[#6A38C2] rounded-full text-sm"
              >
                {s}
              </span>
            ))}
          </div>
        ) : (
          <Empty text="No skills added." />
        )}
      </Section>

      <Section title="Experience" icon={<Briefcase />}>
        {p.workExperience?.length ? (
          p.workExperience.map((job, i) => (
            <div key={i} className="mb-6">
              <h3 className="text-xl font-semibold">{job.position}</h3>
              <p className="text-sm text-gray-600">
                {job.company} • {formatDate(job.startDate)} –{" "}
                {job.endDate ? formatDate(job.endDate) : "Present"}
              </p>
              <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                {job.description}
              </p>
            </div>
          ))
        ) : (
          <Empty text="No work experience." />
        )}
      </Section>

      <Section title="Education" icon={<GraduationCap />}>
        {p.education?.length ? (
          p.education.map((edu, i) => (
            <div key={i} className="mb-5">
              <h3 className="font-semibold">{edu.degree}</h3>
              <p className="text-sm text-gray-600">
                {edu.school} {edu.major && `— ${edu.major}`}
              </p>
              <p className="text-sm text-gray-600">
                {formatDate(edu.startDate)} –{" "}
                {edu.endDate ? formatDate(edu.endDate) : "Present"}
              </p>
            </div>
          ))
        ) : (
          <Empty text="No education added." />
        )}
      </Section>

      <Section title="Languages" icon={<Languages />}>
        {p.languages?.length ? (
          p.languages.map((lang, i) => (
            <p key={i} className="text-sm">
              • {lang.language} — {lang.level || lang.proficiency}
            </p>
          ))
        ) : (
          <Empty text="No languages added." />
        )}
      </Section>

      <Section title="Projects" icon={<FolderGit2 />}>
        {p.projects?.length ? (
          p.projects.map((proj, i) => (
            <div key={i} className="mb-4">
              <h3 className="text-lg font-semibold">{proj.name}</h3>
              <p className="text-sm">{proj.description}</p>
            </div>
          ))
        ) : (
          <Empty text="No projects added." />
        )}
      </Section>

      <Section title="Certifications" icon={<Award />}>
        {p.certifications?.length ? (
          p.certifications.map((cert, i) => (
            <p key={i} className="text-sm mb-2">
              • {cert.name} — {cert.organization}
            </p>
          ))
        ) : (
          <Empty text="No certifications added." />
        )}
      </Section>

      <Section title="Achievements" icon={<Star />}>
        {p.achievements?.length ? (
          p.achievements.map((ach, i) => <p key={i}>• {ach}</p>)
        ) : (
          <Empty text="No achievements added." />
        )}
      </Section>
    </div>
  );
};

export default RecruiterResume;
