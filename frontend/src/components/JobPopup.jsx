import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatSalary } from "../utils/formatSalary";
import { formatLocation } from "../utils/formatLocation";

const JobPopup = ({ job, position = "right" }) => {
  const navigate = useNavigate();

  const positionClasses =
    position === "middle" ? "right-[105%] mr-2" : "left-[105%] ml-2";

  const arrowClasses =
    position === "right"
      ? "top-8 -right-1.5 border-r border-t"
      : "top-8 -left-1.5 border-l border-b";

  const parseList = (data) => {
    if (!data) return [];
    let textStr = Array.isArray(data) ? data.join("\n") : String(data);
    const cleanText = textStr.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ");

    return cleanText
      .split(/\n|•|-|<br>/)
      .map((item) => item.trim())
      .filter((item) => item.length > 5)
      .slice(0, 3);
  };

  const descriptionPoints = parseList(job?.description);
  const daysLeft = Math.ceil(
    (new Date(job?.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const isExpired = daysLeft < 0;

  return (
    <div
      className={`absolute top-0 w-[380px] bg-white rounded-xl shadow-xl border border-gray-200 p-0 z-[999] hidden group-hover:block animate-in fade-in zoom-in-95 duration-200 ${positionClasses}`}
    >
      {/* --- HEADER --- */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-b from-purple-50/30 to-white rounded-t-xl">
        <div className="flex gap-4">
          <div className="h-14 w-14 flex-shrink-0 rounded-lg border border-gray-100 bg-white p-1 flex items-center justify-center shadow-sm">
            <Avatar className="h-full w-full rounded-md">
              <AvatarImage
                src={job?.company?.logo}
                className="object-contain"
              />
              <AvatarFallback className="rounded-md bg-gray-50 text-gray-400">
                <Building2 size={24} />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className="font-bold text-gray-900 leading-snug text-[15px] line-clamp-2 mb-1 hover:text-[#6A38C2] cursor-pointer transition-colors"
              onClick={() => navigate(`/description/${job._id}`)}
            >
              {job?.title}
            </h4>
            <p className="text-xs text-gray-500 font-medium line-clamp-1 mb-2">
              {job?.company?.name}
            </p>
            <div className="flex items-center gap-1.5 text-[#6A38C2] font-bold text-sm bg-purple-50 w-fit px-2 py-0.5 rounded">
              <DollarSign size={14} />
              {formatSalary(job?.salary)}
            </div>
          </div>
        </div>
      </div>

      {/* --- BODY --- */}
      <div className="p-5 space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <div className="bg-gray-50 px-2.5 py-1 rounded-md text-xs text-gray-600 font-medium flex items-center gap-1.5 border border-gray-100">
            <MapPin size={12} className="text-gray-400" />
            <span className="truncate max-w-[120px]">
              {formatLocation(job?.location)}
            </span>
          </div>
          <div className="bg-gray-50 px-2.5 py-1 rounded-md text-xs text-gray-600 font-medium flex items-center gap-1.5 border border-gray-100">
            <Briefcase size={12} className="text-gray-400" />
            {job?.experienceLevel
              ? `${job.experienceLevel} Years`
              : "Not required"}
          </div>
          <div
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 border ${
              isExpired
                ? "bg-red-50 text-red-600 border-red-100"
                : "bg-green-50 text-green-600 border-green-100"
            }`}
          >
            <Clock size={12} />
            {isExpired ? "Expired" : `Remaining ${daysLeft} days`}
          </div>
        </div>

        {/* Short Description */}
        {descriptionPoints.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 relative">
            <ul className="space-y-1.5">
              {descriptionPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-[13px] text-gray-600 leading-snug"
                >
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 shrink-0"></div>
                  <span className="line-clamp-2">{point}</span>
                </li>
              ))}
            </ul>
            {/* Fade out effect */}
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-gray-50 to-transparent rounded-b-lg"></div>
          </div>
        )}
      </div>

      {/* --- FOOTER --- */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex gap-3">
        <Button
          className="flex-1 bg-[#6A38C2] hover:bg-[#5b30a6] text-white h-9 text-sm font-semibold rounded-lg shadow-sm transition-all"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/description/${job._id}`);
          }}
        >
          Apply now
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-gray-300 text-gray-600 hover:text-[#6A38C2] hover:border-[#6A38C2] hover:bg-white h-9 text-sm font-semibold rounded-lg transition-all"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/description/${job._id}`);
          }}
        >
          Detail
        </Button>
      </div>

      {/* Arrow Pointer */}
      <div
        className={`hidden md:block absolute w-3 h-3 bg-white border-gray-200 transform rotate-45 ${arrowClasses}`}
      ></div>
    </div>
  );
};

export default JobPopup;
