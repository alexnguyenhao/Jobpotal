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

/* ============================================================
   MAIN COMPONENT
   Renders a profile section item based on available props.
============================================================ */
const ProfileSectionItem = ({ item }) => {
  if (!item) return null;

  // destructure properties from the item object
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

  /* ---------- Work Experience ---------- */
  // If company and position exist, render as Work Experience
  if (company && position) {
    return (
      <SectionCard>
        <Header
          icon={<Building2 size={18} />}
          title={position}
          subtitle={company}
          date={<DateBlock start={startDate} end={endDate} />}
        />

        {description && <Description text={description} />}
      </SectionCard>
    );
  }

  /* ---------- Education ---------- */
  // If school and degree exist, render as Education
  if (school && degree) {
    return (
      <SectionCard>
        <Header
          icon={<BookOpen size={18} />}
          title={`${degree}${major ? " – " + major : ""}`}
          subtitle={school}
          date={<DateBlock start={startDate} end={endDate} />}
        />
        {description && <Description text={description} />}
      </SectionCard>
    );
  }

  /* ---------- Certifications ---------- */
  // If name and organization exist, render as Certification
  if (name && organization) {
    return (
      <SectionCard>
        <Header
          icon={<Award size={18} />}
          title={name}
          subtitle={organization}
          date={<DateBlock start={startDate} end={endDate} />}
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

        {description && <Description text={description} />}
      </SectionCard>
    );
  }

  /* ---------- Projects ---------- */
  // If title exists (and not caught by previous checks), render as Project
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
            <Link2 size={14} /> {truncate(link, 40)}
          </a>
        )}

        {description && <Description text={description} />}

        {technologies?.length > 0 && <TechList list={technologies} />}
      </SectionCard>
    );
  }

  /* ---------- Languages ---------- */
  // If language exists, render as Language
  if (language) {
    return (
      <SectionCard compact>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <Languages size={16} className="text-[#6A38C2]" />
            {language}
          </div>
          <span className="text-sm text-gray-600">{proficiency}</span>
        </div>
      </SectionCard>
    );
  }

  /* ---------- Achievements ---------- */
  // If item is a string or has a title (and falls through previous checks), render as Achievement
  if (typeof item === "string" || item.title) {
    return (
      <SectionCard compact>
        <div className="flex items-center gap-2 text-gray-800 font-medium">
          <Star size={16} className="text-[#6A38C2]" /> {item.title || item}
        </div>
      </SectionCard>
    );
  }

  return null;
};

/* ============================================================
   SUB COMPONENTS
============================================================ */

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
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-gray-900 font-semibold">
      <span className="text-[#6A38C2]">{icon}</span>
      <span>{title}</span>
    </div>

    {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}

    {/* FIX: div instead of p to avoid nesting issues */}
    {date && <div>{date}</div>}
  </div>
);

const DateBlock = ({ start, end }) => {
  if (!start && !end) return null;
  return (
    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
      <Calendar size={12} className="text-[#6A38C2]" />
      {start?.slice(0, 10)} — {end?.slice(0, 10) || "Present"}
    </div>
  );
};

const Description = ({ text }) => (
  <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{text}</p>
);

const TechList = ({ list }) => (
  <div className="flex flex-wrap gap-2 mt-3">
    {list.map((t, i) => (
      <span
        key={i}
        className="bg-[#6A38C2]/10 text-[#6A38C2] border border-[#6A38C2]/20 text-xs px-2 py-1 rounded-full"
      >
        {t}
      </span>
    ))}
  </div>
);

/* ============================================================
   UTILS
============================================================ */
const truncate = (str, len) =>
  str.length > len ? str.slice(0, len) + "..." : str;

export default ProfileSectionItem;
