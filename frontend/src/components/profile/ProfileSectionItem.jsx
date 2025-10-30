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
    link,
    technologies,
    language,
    proficiency,
  } = item;

  // Work Experience
  if (company && position) {
    return (
      <div className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-all shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-gray-800">
          <Building2 size={16} className="text-[#6A38C2]" />
          {position}
        </div>
        <p className="text-sm text-gray-600">{company}</p>
        {(startDate || endDate) && (
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Calendar size={12} /> {startDate?.slice(0, 10)} →{" "}
            {endDate?.slice(0, 10) || "Present"}
          </p>
        )}
        {description && (
          <p className="text-gray-700 mt-2 text-sm">{description}</p>
        )}
      </div>
    );
  }

  // Education
  if (school && degree) {
    return (
      <div className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-all shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-gray-800">
          <BookOpen size={16} className="text-[#6A38C2]" />
          {degree} - {major}
        </div>
        <p className="text-sm text-gray-600">{school}</p>
        {description && (
          <p className="text-gray-700 mt-2 text-sm">{description}</p>
        )}
      </div>
    );
  }

  // Certifications
  if (name && organization) {
    return (
      <div className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-all shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-gray-800">
          <Award size={16} className="text-[#6A38C2]" />
          {name}
        </div>
        <p className="text-sm text-gray-600">{organization}</p>
        {description && (
          <p className="text-gray-700 mt-2 text-sm">{description}</p>
        )}
      </div>
    );
  }

  // Projects
  if (item.title) {
    return (
      <div className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-all shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-gray-800">
          <Code size={16} className="text-[#6A38C2]" />
          {item.title}
        </div>
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[#6A38C2] flex items-center gap-1 hover:underline"
          >
            <Link2 size={14} />{" "}
            {item.link.length > 40 ? item.link.slice(0, 40) + "..." : item.link}
          </a>
        )}
        {description && (
          <p className="text-gray-700 mt-2 text-sm">{description}</p>
        )}
        {technologies?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {technologies.map((t, i) => (
              <span
                key={i}
                className="bg-[#6A38C2]/10 text-[#6A38C2] border border-[#6A38C2]/20 text-xs px-2 py-1 rounded-md"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Languages
  if (language) {
    return (
      <div className="p-3 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-all shadow-sm">
        <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Languages size={16} className="text-[#6A38C2]" />
          {language}
        </p>
        <p className="text-sm text-gray-600">{proficiency}</p>
      </div>
    );
  }

  // Achievements
  if (typeof item === "string" || item.title) {
    return (
      <div className="p-3 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-all shadow-sm flex items-center gap-2">
        <Star size={16} className="text-[#6A38C2]" /> {item.title || item}
      </div>
    );
  }

  // Fallback
  return null;
};

export default ProfileSectionItem;
