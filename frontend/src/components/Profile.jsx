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
import SavedJobTable from "@/components/SavedJobTable";
import Resume from "./profile/Resume";
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
              <div className="mt-14 flex flex-col items-center text-center gap-4 bg-gradient-to-r from-[#f8f6ff] via-white to-[#f8f6ff] rounded-2xl py-10 px-6 border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                  🎯 Your Professional Resume
                </h3>
                <p className="text-gray-600 max-w-xl text-sm md:text-base">
                  Showcase your skills, experiences, and achievements in a
                  clean, professional format. Perfect for recruiters and
                  employers to review your qualifications.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {/* 🔹 View Resume */}
                  <button
                    onClick={() =>
                      window.open(`/resume/${user?._id}`, "_blank")
                    }
                    className="flex items-center gap-2 bg-[#6A38C2] text-white px-6 py-3 rounded-full font-semibold text-sm shadow-md hover:bg-[#5b29a0] transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 16h8m-8-4h8m-8-4h8M5 8h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2z"
                      />
                    </svg>
                    View Resume
                  </button>
                </div>

                {/* 🌐 Public Link */}
                <div className="mt-5 text-xs md:text-sm text-gray-500">
                  or share your public resume link:{" "}
                  <a
                    href={`/resume/${user?._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6A38C2] font-medium hover:underline"
                  >
                    https://jobportal.com/resume/{user?._id}
                  </a>
                </div>
              </div>
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
              <SavedJobTable />
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
