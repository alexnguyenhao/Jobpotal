import React from "react";
import {
  Calendar,
  Building2,
  BookOpen,
  Award,
  Code,
  Languages,
  Star,
  Link2,
} from "lucide-react";

/**
 * 🔹 ProfileSectionItem v2
 * Giao diện nâng cấp chuyên nghiệp, card mềm, icon rõ ràng.
 */
const ProfileSectionItem = ({ item }) => {
  if (!item) return null;

  const {
    company,
    position,
    school,
    degree,
    major,
    name,
    organization,
    description,
    startDate,
    endDate,
    technologies,
    language,
    proficiency,
    title,
    link,
  } = item;

  // Helper render date
  const renderDates = (start, end) =>
    (start || end) && (
      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
        <Calendar size={12} className="text-[#6A38C2]" />
        {start?.slice(0, 10)} — {end?.slice(0, 10) || "Present"}
      </p>
    );

  // 🔹 Work Experience
  if (company && position) {
    return (
      <SectionCard>
        <Header
          icon={<Building2 size={18} />}
          title={position}
          subtitle={company}
          date={renderDates(startDate, endDate)}
        />
        {description && (
          <p className="mt-2 text-sm text-gray-700">{description}</p>
        )}
      </SectionCard>
    );
  }

  // 🔹 Education
  if (school && degree) {
    return (
      <SectionCard>
        <Header
          icon={<BookOpen size={18} />}
          title={`${degree} – ${major}`}
          subtitle={school}
          date={renderDates(startDate, endDate)}
        />
        {description && (
          <p className="mt-2 text-sm text-gray-700">{description}</p>
        )}
      </SectionCard>
    );
  }

  // 🔹 Certifications
  if (name && organization) {
    return (
      <SectionCard>
        <Header
          icon={<Award size={18} />}
          title={name}
          subtitle={organization}
          date={renderDates(startDate, endDate)}
        />
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[#6A38C2] text-sm mt-1 hover:underline"
          >
            <Link2 size={14} /> View credential
          </a>
        )}
        {description && (
          <p className="mt-2 text-sm text-gray-700">{description}</p>
        )}
      </SectionCard>
    );
  }

  // 🔹 Projects
  if (title) {
    return (
      <SectionCard>
        <Header icon={<Code size={18} />} title={title} />
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[#6A38C2] text-sm hover:underline"
          >
            <Link2 size={14} />{" "}
            {link.length > 35 ? link.slice(0, 35) + "..." : link}
          </a>
        )}
        {description && (
          <p className="mt-2 text-sm text-gray-700">{description}</p>
        )}
        {technologies?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {technologies.map((t, i) => (
              <span
                key={i}
                className="bg-[#6A38C2]/10 text-[#6A38C2] border border-[#6A38C2]/20 text-xs px-2 py-1 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </SectionCard>
    );
  }

  // 🔹 Languages
  if (language) {
    return (
      <SectionCard compact>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-gray-800 font-semibold">
            <Languages size={16} className="text-[#6A38C2]" /> {language}
          </p>
          <span className="text-sm text-gray-600">{proficiency}</span>
        </div>
      </SectionCard>
    );
  }

  // 🔹 Achievements
  if (typeof item === "string" || item.title) {
    return (
      <SectionCard compact>
        <p className="flex items-center gap-2 text-gray-800 font-medium">
          <Star size={16} className="text-[#6A38C2]" /> {item.title || item}
        </p>
      </SectionCard>
    );
  }

  return null;
};
const SectionCard = ({ children, compact }) => (
  <div
    className={`p-4 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 ${
      compact ? "py-3" : ""
    }`}
  >
    {children}
  </div>
);

const Header = ({ icon, title, subtitle, date }) => (
  <div>
    <div className="flex items-center gap-2 text-gray-900 font-semibold">
      <span className="text-[#6A38C2]">{icon}</span>
      <span>{title}</span>
    </div>
    {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    {date && <p className="text-sm text-gray-600">{date}</p>}
  </div>
);

export default ProfileSectionItem;
