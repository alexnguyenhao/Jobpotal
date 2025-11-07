import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Contact,
  MapPin,
  Upload,
  Star,
  Folder,
  Calendar,
  User2,
} from "lucide-react";
import GlassCard from "@/components/common/GlassCard";
import ProfileCompletion from "./ProfileCompletion";

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 text-sm text-gray-700">
    <Icon size={16} className="text-[#6A38C2]" />
    <strong>{label}:</strong> {value || "—"}
  </div>
);

const ProfileHeader = ({
  user,
  fileInputRef,
  onClickAvatar,
  onAvatarChange,
  onEdit,
}) => (
  <GlassCard>
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="relative group">
        <Avatar className="h-36 w-36 border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform">
          <AvatarImage src={user?.profilePhoto} alt={user?.fullName} />
        </Avatar>
        <button
          onClick={onClickAvatar}
          className="absolute bottom-2 right-2 bg-[#6A38C2] text-white p-2 rounded-full shadow-md hover:scale-110 transition-all"
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

      <div className="flex-1 text-center md:text-left space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">{user?.fullName}</h1>
        <p className="text-gray-600">{user?.bio || "No bio yet"}</p>
        <p className="text-gray-500 italic">
          {user?.profile?.careerObjective || "No career objective yet"}
        </p>

        <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-inner">
          <InfoItem
            icon={Calendar}
            label="Date of Birth"
            value={user?.dateOfBirth.split("T")[0]}
          />
          <InfoItem icon={User2} label="Gender" value={user?.gender} />
          <InfoItem icon={Mail} label="Email" value={user?.email} />
          <InfoItem icon={Contact} label="Phone" value={user?.phoneNumber} />
          <InfoItem icon={MapPin} label="Location" value={user?.address} />
          <InfoItem
            icon={Star}
            label="Skills"
            value={user?.profile?.skills?.join(", ")}
          />
          <InfoItem
            icon={Folder}
            label="Resume"
            value={
              user?.resume ? (
                <a
                  href={user.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6A38C2] hover:underline"
                >
                  View Resume
                </a>
              ) : (
                "No resume uploaded"
              )
            }
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-3">
          <ProfileCompletion profile={user?.profile} />
          <Button
            onClick={onEdit}
            className="bg-[#6A38C2] hover:bg-[#592ba3] text-white px-6 py-2 shadow-md"
          >
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  </GlassCard>
);

export default ProfileHeader;
