import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Eye, Calendar } from "lucide-react";

const GuideCard = ({ guide }) => {
  return (
    <Link to={`/career-guide/detail/${guide.slug || guide._id}`}>
      <Card className="h-full border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col bg-white rounded-2xl">
        {/* Thumbnail Image */}
        <div className="relative h-52 w-full overflow-hidden">
          {guide.thumbnail ? (
            <img
              src={guide.thumbnail}
              alt={guide.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 font-medium">
              No Image
            </div>
          )}
          {/* Category Badge */}
          <Badge className="absolute top-4 left-4 bg-white/95 text-[#6A38C2] hover:bg-white shadow-sm backdrop-blur-sm capitalize px-3 py-1 text-xs font-bold rounded-full">
            {guide.category.replace("-", " ")}
          </Badge>
        </div>

        {/* Content */}
        <CardHeader className="p-5 flex-grow">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 font-medium">
            <Calendar size={14} className="text-[#6A38C2]" />
            {new Date(guide.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          <h3 className="text-xl font-bold leading-snug text-gray-900 group-hover:text-[#6A38C2] transition-colors line-clamp-2">
            {guide.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3 mt-3 leading-relaxed">
            {guide.excerpt ||
              "Click to read the full article to gain more insights..."}
          </p>
        </CardHeader>

        {/* Footer */}
        <CardFooter className="p-5 pt-0 mt-auto flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-gray-100">
              <AvatarImage src={guide.author?.profilePhoto} />
              <AvatarFallback className="text-[10px] bg-purple-50 text-[#6A38C2]">
                AD
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-gray-700 truncate max-w-[100px]">
              {guide.author?.fullName || "Admin"}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1">
              <Clock size={14} /> {guide.readingTime || 3}m
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} /> {guide.views}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default GuideCard;
