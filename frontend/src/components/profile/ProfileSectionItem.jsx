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
  Trophy,
  LayoutTemplate,
  ExternalLink,
  Zap,
} from "lucide-react";

// --- HELPERS ---
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
};

const truncate = (str, len) =>
  str && str.length > len ? str.slice(0, len) + "..." : str;

const SectionCard = ({ children, compact, className = "" }) => (
  <div
    className={`group relative bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#6A38C2]/30 transition-all duration-300 ${
      compact ? "py-3 px-4" : ""
    } ${className}`}
  >
    {children}
  </div>
);

const ModernHeader = ({ icon, title, subtitle, rightElement, subLink }) => (
  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 p-2 rounded-lg bg-[#6A38C2]/10 text-[#6A38C2] group-hover:bg-[#6A38C2] group-hover:text-white transition-colors duration-300">
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-gray-900 text-[15px] leading-tight flex items-center gap-2">
          {title}
          {subLink && (
            <a
              href={subLink}
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-[#6A38C2] transition-colors"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </h3>
        {subtitle && (
          <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>

    {rightElement && (
      <div className="pl-[3.25rem] sm:pl-0 sm:text-right flex-shrink-0">
        {rightElement}
      </div>
    )}
  </div>
);

const DateBadge = ({ start, end, isCurrent }) => {
  if (!start) return null;
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 text-xs font-medium text-gray-500 border border-gray-100 whitespace-nowrap">
      <Calendar size={12} className="text-gray-400" />
      <span>
        {formatDate(start)} — {isCurrent || !end ? "Present" : formatDate(end)}
      </span>
    </div>
  );
};

const Description = ({ text }) => (
  <div className="mt-4 pl-[3.25rem] text-sm text-gray-600 leading-relaxed whitespace-pre-line">
    {text}
  </div>
);

const TechList = ({ list }) => (
  <div className="mt-3 pl-[3.25rem] flex flex-wrap gap-2">
    {list.map((t, i) => (
      <span
        key={i}
        className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-50 text-gray-600 border border-gray-200 hover:bg-[#6A38C2]/5 hover:text-[#6A38C2] hover:border-[#6A38C2]/20 transition-all"
      >
        {t}
      </span>
    ))}
  </div>
);

const ProfileSectionItem = ({ item, type }) => {
  if (!item) return null;

  if (typeof item === "string") {
    return (
      <SectionCard compact className="inline-block mr-2 mb-2 w-auto">
        <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
          <Star
            size={14}
            className="text-[#6A38C2]"
            fill="currentColor"
            fillOpacity={0.2}
          />
          {item}
        </div>
      </SectionCard>
    );
  }

  const {
    company,
    position,
    startDate,
    endDate,
    isCurrent,
    isWorking,
    school,
    degree,
    major,
    name,
    level,
    organization,
    dateIssued,
    expirationDate,
    url,
    link,
    technologies,
    year,
    date,
    language,
    proficiency,
    title,
    description,
    platform, // Social Links
  } = item;

  // Social Links
  if (platform && url) {
    return (
      <SectionCard
        compact
        className="inline-flex items-center gap-2 mr-2 mb-2 w-auto"
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-700 text-sm">{platform}</span>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-[#6A38C2] hover:underline flex items-center gap-1 text-xs"
          >
            Visit <ExternalLink size={12} />
          </a>
        </div>
      </SectionCard>
    );
  }

  // Work Experience
  if (company && position) {
    return (
      <SectionCard>
        <ModernHeader
          icon={<Building2 size={18} />}
          title={position}
          subtitle={company}
          rightElement={
            <DateBadge start={startDate} end={endDate} isCurrent={isCurrent} />
          }
        />
        {description && <Description text={description} />}
      </SectionCard>
    );
  }

  // Operations
  if (type === "Operations" || (title && position && !company)) {
    return (
      <SectionCard>
        <ModernHeader
          icon={<LayoutTemplate size={18} />}
          title={title}
          subtitle={position}
          rightElement={
            <DateBadge start={startDate} end={endDate} isCurrent={isCurrent} />
          }
        />
        {description && <Description text={description} />}
      </SectionCard>
    );
  }

  // Education
  if (school) {
    return (
      <SectionCard>
        <ModernHeader
          icon={<BookOpen size={18} />}
          title={school}
          subtitle={`${degree || ""} ${major ? `• ${major}` : ""}`}
          rightElement={
            <DateBadge start={startDate} end={endDate} isCurrent={isCurrent} />
          }
        />
        {description && <Description text={description} />}
      </SectionCard>
    );
  }

  // Projects
  if (type === "Projects" || (title && (link || technologies))) {
    return (
      <SectionCard>
        <ModernHeader
          icon={<Code size={18} />}
          title={title}
          subLink={link}
          rightElement={
            <DateBadge start={startDate} end={endDate} isCurrent={isWorking} />
          }
          subtitle={
            link ? (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="text-[#6A38C2] hover:underline hover:text-[#532b99] flex items-center gap-1 transition-colors"
              >
                <Link2 size={12} />
                {truncate(link, 40)}
              </a>
            ) : null
          }
        />
        {technologies?.length > 0 && <TechList list={technologies} />}
        {description && <Description text={description} />}
      </SectionCard>
    );
  }

  // Certifications
  if (type === "Certifications" || (name && organization)) {
    return (
      <SectionCard>
        <ModernHeader
          icon={<Award size={18} />}
          title={name}
          subtitle={organization}
          subLink={url}
          rightElement={
            <div className="flex flex-col items-end gap-1">
              {dateIssued && (
                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                  Issued: {formatDate(dateIssued)}
                </span>
              )}
              {expirationDate && (
                <span className="text-[10px] text-gray-400">
                  Expires: {formatDate(expirationDate)}
                </span>
              )}
            </div>
          }
        />
      </SectionCard>
    );
  }

  // Achievements
  if (type === "Achievements" || (title && (year || date))) {
    const displayDate = date ? formatDate(date).split(",")[1] : year;
    return (
      <SectionCard>
        <ModernHeader
          icon={<Trophy size={18} />}
          title={title}
          rightElement={
            displayDate && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#6A38C2] bg-[#6A38C2]/10 px-2 py-1 rounded">
                <Calendar size={10} /> {displayDate}
              </span>
            )
          }
        />
        {description && <Description text={description} />}
      </SectionCard>
    );
  }

  // Languages
  if (language) {
    return (
      <SectionCard compact className="flex items-center justify-between group">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Languages size={16} />
          </div>
          <span className="font-bold text-gray-800 text-sm">{language}</span>
        </div>
        {proficiency && (
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
            {proficiency}
          </span>
        )}
      </SectionCard>
    );
  }

  // Skills
  if (name && level) {
    return (
      <SectionCard
        compact
        className="inline-flex items-center gap-2 mr-2 mb-2 w-auto pr-3"
      >
        <Zap
          size={14}
          className="text-[#6A38C2]"
          fill="currentColor"
          fillOpacity={0.2}
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700 leading-none">
            {name}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">{level}</span>
        </div>
      </SectionCard>
    );
  }

  if (title || name) {
    return (
      <SectionCard
        compact
        className="inline-flex items-center gap-2 mr-2 mb-2 w-auto"
      >
        <Star
          size={14}
          className="text-[#6A38C2]"
          fill="currentColor"
          fillOpacity={0.2}
        />
        <span className="text-sm font-medium text-gray-700">
          {title || name}
        </span>
      </SectionCard>
    );
  }

  return null;
};

export default ProfileSectionItem;
