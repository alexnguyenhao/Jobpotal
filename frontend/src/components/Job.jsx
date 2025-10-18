import React from "react";
import { Button } from "@/components/ui/button.js";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar.js";
import { Badge } from "@/components/ui/badge.js";
import { useNavigate } from "react-router-dom";
import { CalendarDays, DollarSign } from "lucide-react";

const Jobs = ({ job }) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentAt = new Date();
    const timeDifference = currentAt - createdAt;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} ago`;
  };
  const handleCardClick = () => {
    navigate(`/description/${job._id}`);
  };

  return (
    <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-md hover:shadow-lg transition duration-300 flex flex-col justify-between h-full">
      {/* Top Row */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <p>{daysAgoFunction(job?.createdAt)}</p>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-blue-600"
        >
          <Bookmark size={16} />
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-12 w-12 hover:shadow-md transition duration-300">
          <AvatarImage src={job?.company?.logo} />
        </Avatar>
        <div>
          <h2 className="font-semibold text-gray-800 text-base truncate hover:underline cursor-pointer">
            {job?.company?.name}
          </h2>
          <p className="text-sm text-gray-500 hover:underline cursor-pointer">
            {job?.location}
          </p>
        </div>
      </div>

      {/* Job Title */}
      <div className="mb-3">
        <h1
          onClick={handleCardClick}
          className="font-bold text-lg text-blue-800 line-clamp-1 hover:underline cursor-pointer"
        >
          {job?.title}
        </h1>
        <p className="text-sm text-gray-600 line-clamp-2">{job?.description}</p>
      </div>

      {/* Only Salary & Deadline */}
      <div className="flex flex-wrap items-center gap-3 mt-2 mb-5">
        <Badge
          className="text-[#7209B7] font-medium flex items-center gap-1"
          variant="outline"
        >
          <DollarSign className="w-4 h-4" />
          {job?.salary}M
        </Badge>

        <Badge
          className="text-green-700 font-medium flex items-center gap-1"
          variant="outline"
        >
          <CalendarDays className="w-4 h-4" />
          Deadline:{" "}
          {new Date(job?.applicationDeadline).toLocaleDateString("en-GB")}
        </Badge>
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-2 mt-auto">
        <Button
          variant="outline"
          className="w-1/2 text-sm"
          onClick={() => navigate(`/description/${job?._id}`)}
        >
          View
        </Button>
        <Button className="bg-[#7209B7] text-white w-1/2 text-sm hover:bg-[#5e0e9e]">
          Save
        </Button>
      </div>
    </div>
  );
};

export default Jobs;
