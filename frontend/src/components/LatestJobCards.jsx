import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Building2, MapPin, Clock, DollarSign } from "lucide-react";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/description/${job._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group p-5 rounded-2xl bg-white border border-gray-100 shadow-sm cursor-pointer 
      transition-all duration-300 hover:shadow-xl hover:border-[#6A38C2]/30 hover:-translate-y-1 flex flex-col h-full"
    >
      {/* --- HEADER: LOGO & COMPANY --- */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10 rounded-lg border bg-gray-50">
          <AvatarImage src={job?.company?.logo} objectFit="object-contain" />
          <AvatarFallback className="rounded-lg text-gray-400 font-bold">
            <Building2 size={20} />
          </AvatarFallback>
        </Avatar>

        <div className="overflow-hidden">
          <h2 className="font-semibold text-sm text-gray-700 truncate">
            {job?.company?.name}
          </h2>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={12} />
            <span className="truncate">
              {job?.location?.province || "Remote"}
            </span>
          </div>
        </div>
      </div>

      {/* --- BODY: TITLE & DESC --- */}
      <div className="mb-4 flex-grow">
        <h1 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-[#6A38C2] transition-colors line-clamp-2 mb-2">
          {job?.title}
        </h1>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {job?.description}
        </p>
      </div>

      {/* --- FOOTER: BADGES --- */}
      <div className="flex flex-wrap items-center gap-2 mt-auto">
        {/* Job Type Badge */}
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 font-normal px-2 py-1 rounded-md text-xs"
        >
          {job?.jobType || "Full Time"}
        </Badge>

        {/* Salary Badge */}
        <Badge
          variant="secondary"
          className="bg-green-50 text-green-700 hover:bg-green-100 border-green-100 font-normal px-2 py-1 rounded-md text-xs flex items-center gap-0.5"
        >
          <DollarSign size={12} /> {formatSalary(job?.salary)}
        </Badge>

        {/* Deadline Badge (Optional) */}
        {/* <Badge variant="secondary" className="bg-gray-100 text-gray-600 font-normal px-2 py-1 rounded-md text-xs flex items-center gap-0.5">
             <Clock size={12} /> {daysLeft(job?.applicationDeadline)}
        </Badge> */}
      </div>
    </div>
  );
};

// Helper: Format Salary (Rút gọn số liệu: 10M, 15M...)
const formatSalary = (salary) => {
  if (!salary) return "N/A";
  if (typeof salary === "string") return salary;
  const { min, max, isNegotiable } = salary;

  if (isNegotiable) return "Negotiable";

  const formatNum = (n) => (n >= 1000000 ? `${n / 1000000}M` : `${n / 1000}K`);

  if (min && max) return `${formatNum(min)} - ${formatNum(max)}`;
  if (min) return `From ${formatNum(min)}`;
  if (max) return `Up to ${formatNum(max)}`;

  return "N/A";
};

// Helper (Optional): Calculate Days Left
// const daysLeft = (date) => {
//     if(!date) return "No Deadline";
//     const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
//     return diff > 0 ? `${diff} days left` : "Expired";
// }

export default LatestJobCards;
