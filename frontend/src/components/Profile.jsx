import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import {
  Briefcase,
  Save,
  Settings,
  User,
  GraduationCap,
  Award,
  Languages,
  Star,
  FolderGit2,
} from "lucide-react";

import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSections from "@/components/profile/ProfileSections";
import GlassCard from "@/components/common/GlassCard";
import AppliedJobTable from "@/components/AppliedJobTable";
import SettingAccount from "@/components/profile/SettingAccount";

import UpdateProfileDialog from "@/components/profile/UpdateProfileDialog";
import UpdateTitleProfileDialog from "@/components/profile/UpdateTitleProfileDialog";
import UpdateWorkExperienceDialog from "@/components/profile/UpdateWorkExperienceDialog";
import UpdateEducationDialog from "@/components/profile/UpdateEducationDialog";
import UpdateCertificationDialog from "@/components/profile/UpdateCertificationDialog";
import UpdateLanguagesDialog from "@/components/profile/UpdateLanguagesDialog";
import UpdateAchievementsDialog from "@/components/profile/UpdateAchievementsDialog";
import UpdateProjectsDialog from "@/components/profile/UpdateProjectsDialog";

const Profile = () => {
  useGetAppliedJobs();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const [tab, setTab] = useState("personal");
  const [openJobsMenu, setOpenJobsMenu] = useState(false);

  // Dialog states
  const [open, setOpen] = useState({
    profile: false,
    title: false,
    work: false,
    edu: false,
    cert: false,
    lang: false,
    achieve: false,
    proj: false,
  });

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.put(
        `${USER_API_END_POINT}/update-avatar`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success("Avatar updated!");
      dispatch(setUser({ ...user, profilePhoto: res.data.profilePhoto }));
    } catch {
      toast.error("Failed to update picture");
    }
  };

  const profileSections = [
    {
      title: "Title",
      icon: User,
      data: [user?.profile?.title],
      openSetter: (v) => setOpen({ ...open, title: v }),
    },
    {
      title: "Work Experience",
      icon: Briefcase,
      data: user?.profile?.workExperience,
      openSetter: (v) => setOpen({ ...open, work: v }),
    },
    {
      title: "Education",
      icon: GraduationCap,
      data: user?.profile?.education,
      openSetter: (v) => setOpen({ ...open, edu: v }),
    },
    {
      title: "Certifications",
      icon: Award,
      data: user?.profile?.certifications,
      openSetter: (v) => setOpen({ ...open, cert: v }),
    },
    {
      title: "Languages",
      icon: Languages,
      data: user?.profile?.languages,
      openSetter: (v) => setOpen({ ...open, lang: v }),
    },
    {
      title: "Achievements",
      icon: Star,
      data: user?.profile?.achievements,
      openSetter: (v) => setOpen({ ...open, achieve: v }),
    },
    {
      title: "Projects",
      icon: FolderGit2,
      data: user?.profile?.projects,
      openSetter: (v) => setOpen({ ...open, proj: v }),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
        <ProfileSidebar
          tab={tab}
          setTab={setTab}
          openJobsMenu={openJobsMenu}
          setOpenJobsMenu={setOpenJobsMenu}
        />

        <main className="flex-1 space-y-8">
          {tab === "personal" && (
            <>
              <ProfileHeader
                user={user}
                fileInputRef={fileInputRef}
                onClickAvatar={() => fileInputRef.current.click()}
                onAvatarChange={handleAvatarChange}
                onEdit={() => setOpen({ ...open, profile: true })}
              />
              <ProfileSections sections={profileSections} />
            </>
          )}

          {tab === "applied" && (
            <GlassCard title="Applied Jobs" icon={Briefcase}>
              <AppliedJobTable />
            </GlassCard>
          )}

          {tab === "saved" && (
            <GlassCard title="Saved Jobs" icon={Save}>
              <p className="text-gray-500 italic">No saved jobs yet</p>
            </GlassCard>
          )}

          {tab === "settings" && (
            <GlassCard title="Account Settings" icon={Settings}>
              <SettingAccount />
            </GlassCard>
          )}
        </main>
      </div>

      {/* Dialogs */}
      <UpdateProfileDialog
        open={open.profile}
        setOpen={(v) => setOpen({ ...open, profile: v })}
      />
      <UpdateTitleProfileDialog
        open={open.title}
        setOpen={(v) => setOpen({ ...open, title: v })}
      />
      <UpdateWorkExperienceDialog
        open={open.work}
        setOpen={(v) => setOpen({ ...open, work: v })}
      />
      <UpdateEducationDialog
        open={open.edu}
        setOpen={(v) => setOpen({ ...open, edu: v })}
      />
      <UpdateCertificationDialog
        open={open.cert}
        setOpen={(v) => setOpen({ ...open, cert: v })}
      />
      <UpdateLanguagesDialog
        open={open.lang}
        setOpen={(v) => setOpen({ ...open, lang: v })}
      />
      <UpdateAchievementsDialog
        open={open.achieve}
        setOpen={(v) => setOpen({ ...open, achieve: v })}
      />
      <UpdateProjectsDialog
        open={open.proj}
        setOpen={(v) => setOpen({ ...open, proj: v })}
      />
    </div>
  );
};

export default Profile;
