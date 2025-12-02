import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Upload,
  Calendar,
  User,
  Edit2,
  Globe,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import GlassCard from "@/components/common/GlassCard";
import ProfileCompletion from "./ProfileCompletion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const InfoItem = ({ icon: Icon, label, value, isLink, linkUrl }) => {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-700 w-full overflow-hidden">
      <div className="p-2 bg-purple-50 rounded-full text-[#6A38C2] shrink-0">
        <Icon size={16} />
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider leading-tight mb-0.5">
          {label}
        </span>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              {isLink ? (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#6A38C2] hover:underline truncate w-full block cursor-pointer"
                >
                  {value}
                </a>
              ) : (
                <span className="font-medium text-gray-900 truncate w-full block cursor-default">
                  {value || "—"}
                </span>
              )}
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px] break-words bg-gray-900 text-white border-none">
              <p>{value}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

// Helper để lấy icon mạng xã hội
const getSocialIcon = (platform) => {
  const p = platform.toLowerCase();
  if (p.includes("github")) return Github;
  if (p.includes("linkedin")) return Linkedin;
  if (p.includes("twitter")) return Twitter;
  return Globe;
};

const ProfileHeader = ({
  user,
  fileInputRef,
  onClickAvatar,
  onAvatarChange,
  onEdit,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <GlassCard className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-bl-full -z-10 opacity-50" />

      <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
        {/* Avatar Section */}
        <div className="relative group mx-auto md:mx-0 shrink-0">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-xl cursor-pointer bg-white">
            <AvatarImage
              src={user?.profilePhoto}
              alt={user?.fullName}
              className="object-cover"
            />
            <AvatarFallback className="text-4xl font-bold bg-purple-100 text-[#6A38C2]">
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <button
            onClick={onClickAvatar}
            className="absolute bottom-2 right-2 bg-[#6A38C2] text-white p-2 rounded-full shadow-lg hover:bg-[#582bb6] hover:scale-110 transition-all border-2 border-white z-20"
            title="Change Avatar"
          >
            <Upload size={16} />
          </button>
          <input
            ref={fileInputRef}
            onChange={onAvatarChange}
            type="file"
            accept="image/*"
            className="hidden"
          />
        </div>
        <div className="flex-1 w-full space-y-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight truncate">
              {user?.fullName}
            </h1>
            <p className="text-lg text-[#6A38C2] font-medium mt-1 truncate">
              {user?.profile?.title || "Open to work"}
            </p>
            <p className="text-gray-500 mt-2 max-w-2xl leading-relaxed line-clamp-2">
              {user?.bio ||
                "Update your bio to introduce yourself to recruiters."}
            </p>
            {user?.profile?.socialLinks?.length > 0 && (
              <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
                {user.profile.socialLinks.map((link, idx) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-400 hover:text-[#6A38C2] transition-colors"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 bg-white/60 p-5 rounded-2xl border border-gray-100">
            <InfoItem icon={Mail} label="Email" value={user?.email} />
            <InfoItem icon={Phone} label="Phone" value={user?.phoneNumber} />
            <InfoItem icon={MapPin} label="Location" value={user?.address} />
            <InfoItem
              icon={Calendar}
              label="Birthday"
              value={formatDate(user?.dateOfBirth)}
            />
            <InfoItem icon={User} label="Gender" value={user?.gender} />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
            <div className="w-full sm:w-auto">
              <ProfileCompletion profile={user?.profile} />
            </div>

            <Button
              onClick={onEdit}
              className="bg-[#6A38C2] hover:bg-[#582bb6] text-white px-6 shadow-lg shadow-purple-100 w-full sm:w-auto"
            >
              <Edit2 size={16} className="mr-2" /> Edit Personal Info
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default ProfileHeader;
