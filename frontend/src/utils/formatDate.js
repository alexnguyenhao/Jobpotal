// utils/formatDate.js
export const formatDate = (dateStr) => {
  if (!dateStr) return "";

  if (dateStr.toLowerCase() === "present") return "Present";

  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;

  return d.toLocaleDateString("en-US", {
    day: "numeric",
    year: "numeric",
    month: "short",
  });
};

export const formatRange = (start, end) => {
  return `${formatDate(start)} → ${end ? formatDate(end) : "Present"}`;
};
