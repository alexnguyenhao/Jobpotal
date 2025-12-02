import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

// Hooks & Constants
import { useGetAppliedJobs } from "@/hooks/useGetAppliedJobs";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

// Icons
import {
  Briefcase,
  User,
  GraduationCap,
  Award,
  Languages,
  Star,
  FolderGit2,
  FileText,
  PenBox,
  ExternalLink,
  Users,
  MessageCircleHeart,
  Zap,
  Globe, // Mới thêm Globe
} from "lucide-react";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSections from "@/components/profile/ProfileSections";
import { Button } from "@/components/ui/button";

// Import Dialogs
import UpdateProfileDialog from "@/components/profile/UpdateProfileDialog";
import UpdateTitleProfileDialog from "@/components/profile/UpdateTitleProfileDialog";
import UpdateWorkExperienceDialog from "@/components/profile/UpdateWorkExperienceDialog";
import UpdateEducationDialog from "@/components/profile/UpdateEducationDialog";
import UpdateCertificationDialog from "@/components/profile/UpdateCertificationDialog";
import UpdateLanguagesDialog from "@/components/profile/UpdateLanguagesDialog";
import UpdateAchievementsDialog from "@/components/profile/UpdateAchievementsDialog";
import UpdateProjectsDialog from "@/components/profile/UpdateProjectsDialog";
import UpdateOperationsDialog from "@/components/profile/UpdateoperationsDialog";
import UpdateInterestsDialog from "@/components/profile/UpdateinterestsDialog";
import UpdateSkillsDialog from "@/components/profile/UpdateSkillsDialog";
import UpdateSocialLinksDialog from "@/components/profile/UpdateSocialLinksDialog"; // Mới thêm

const Profile = () => {
  useGetAppliedJobs();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const fileInputRef = useRef(null);

  const [open, setOpen] = useState({
    profile: false,
    title: false,
    work: false,
    edu: false,
    cert: false,
    lang: false,
    achieve: false,
    proj: false,
    operations: false,
    interests: false,
    skills: false,
    social: false, // State mới cho Social Links
  });

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update/photo`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Avatar updated successfully!");
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update picture");
    }
  };

  const profileSections = [
    {
      title: "Professional Title",
      icon: User,
      data: user?.profile?.title ? [{ title: user.profile.title }] : [],
      openSetter: (v) => setOpen((prev) => ({ ...prev, title: v })),
      type: "single",
    },
    {
      title: "Social Links", // Section Mới
      icon: Globe,
      data: user?.profile?.socialLinks || [],
      openSetter: (v) => setOpen((prev) => ({ ...prev, social: v })),
    },
    {
      title: "Skills",
      icon: Zap,
      data: user?.profile?.skills || [],
      openSetter: (v) => setOpen((prev) => ({ ...prev, skills: v })),
    },
    {
      title: "Work Experience",
      icon: Briefcase,
      data: user?.profile?.workExperience || [],
      openSetter: (v) => setOpen((prev) => ({ ...prev, work: v })),
    },
    {
      title: "Education",
      icon: GraduationCap,
      data: user?.profile?.education || [],
      openSetter: (v) => setOpen((prev) => ({ ...prev, edu: v })),
    },
    {
      title: "Projects",
      icon: FolderGit2,
      data: user?.profile?.projects || [],
      openSetter: (v) => setOpen((prev) => ({ ...prev, proj: v })),
    },
    {
      title: "Certifications",
      icon: Award,
      data: user?.profile?.certifications || [],
      openSetter: (v) => setOpen((prev) => ({ ...prev, cert: v })),
    },
    {
      title: "Languages",
      icon: Languages,
      data: user?.profile?.languages || [],
      openSetter: (v) => setOpen((prev) => ({ ...prev, lang: v })),
    },
    {
      title: "Achievements",
      icon: Star,
      data: user?.profile?.achievements || [],
      openSetter: (v) => setOpen((prev) => ({ ...prev, achieve: v })),
    },
    {
      title: "Operations",
      icon: Users,
      data: user?.profile?.operations || [],
      openSetter: (v) => setOpen((prev) => ({ ...prev, operations: v })),
    },
    {
      title: "Interests",
      icon: MessageCircleHeart,
      data: user?.profile?.interests || [],
      openSetter: (v) => setOpen((prev) => ({ ...prev, interests: v })),
    },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-[#6A38C2] h-full"></div>
          <div className="flex items-center gap-4 z-10">
            <div className="bg-purple-50 p-3 rounded-full text-[#6A38C2]">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Resume & CV</h3>
              <p className="text-gray-500 text-sm">
                Create or view your professional CV.
              </p>
            </div>
          </div>

          <div className="flex gap-3 z-10">
            <a href={`/resume`} target="_blank" rel="noreferrer">
              <Button variant="outline" className="gap-2">
                <ExternalLink size={16} /> Public View
              </Button>
            </a>
            <Button
              onClick={() => navigate("/cv/home")}
              className="bg-[#6A38C2] hover:bg-[#5b30a6] gap-2"
            >
              <PenBox size={16} /> CV Builder
            </Button>
          </div>
        </div>

        <ProfileHeader
          user={user}
          onEdit={() => setOpen((prev) => ({ ...prev, profile: true }))}
          fileInputRef={fileInputRef}
          onClickAvatar={() => fileInputRef.current?.click()}
          onAvatarChange={handleAvatarChange}
        />

        <ProfileSections sections={profileSections} />
      </div>

      <UpdateProfileDialog
        open={open.profile}
        setOpen={(v) => setOpen((prev) => ({ ...prev, profile: v }))}
      />
      <UpdateTitleProfileDialog
        open={open.title}
        setOpen={(v) => setOpen((prev) => ({ ...prev, title: v }))}
        initialData={user?.profile?.title || []}
      />

      {/* Dialog Mới */}
      <UpdateSocialLinksDialog
        open={open.social}
        setOpen={(v) => setOpen((prev) => ({ ...prev, social: v }))}
      />

      <UpdateSkillsDialog
        open={open.skills}
        setOpen={(v) => setOpen((prev) => ({ ...prev, skills: v }))}
      />

      <UpdateWorkExperienceDialog
        open={open.work}
        setOpen={(v) => setOpen((prev) => ({ ...prev, work: v }))}
      />
      <UpdateEducationDialog
        open={open.edu}
        setOpen={(v) => setOpen((prev) => ({ ...prev, edu: v }))}
        initialData={user?.profile?.education || []}
      />
      <UpdateCertificationDialog
        open={open.cert}
        setOpen={(v) => setOpen((prev) => ({ ...prev, cert: v }))}
        initialData={user?.profile?.certifications || []}
      />
      <UpdateLanguagesDialog
        open={open.lang}
        setOpen={(v) => setOpen((prev) => ({ ...prev, lang: v }))}
        initialData={user?.profile?.languages || []}
      />
      <UpdateAchievementsDialog
        open={open.achieve}
        setOpen={(v) => setOpen((prev) => ({ ...prev, achieve: v }))}
        initialData={user?.profile?.achievements || []}
      />
      <UpdateProjectsDialog
        open={open.proj}
        setOpen={(v) => setOpen((prev) => ({ ...prev, proj: v }))}
        initialData={user?.profile?.projects || []}
      />
      <UpdateOperationsDialog
        open={open.operations}
        setOpen={(v) => setOpen((prev) => ({ ...prev, operations: v }))}
        initialData={user?.profile?.operations || []}
      />
      <UpdateInterestsDialog
        open={open.interests}
        setOpen={(v) => setOpen((prev) => ({ ...prev, interests: v }))}
        initialData={user?.profile?.interests || []}
      />
    </div>
  );
};

export default Profile;
