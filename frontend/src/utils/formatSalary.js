export const formatSalary = (salary) => {
  if (!salary) return "Negotiable";
  if (typeof salary === "string") return salary;
  if (salary.isNegotiable) return "Negotiable";

  // Format số tiền gọn (ví dụ: 10,000,000 -> 10M)
  const formatNum = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num;
  };

  if (salary.min && salary.max)
    return `${formatNum(salary.min)} - ${formatNum(salary.max)}`;
  if (salary.min) return `From ${formatNum(salary.min)}`;
  if (salary.max) return `Up to ${formatNum(salary.max)}`;
  return "Negotiable";
};
