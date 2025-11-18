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
  Save,
  Settings,
  User,
  GraduationCap,
  Award,
  Languages,
  Star,
  FolderGit2,
  FileText,
  Eye,
  Upload,
} from "lucide-react";

// Components
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSections from "@/components/profile/ProfileSections";
import GlassCard from "@/components/common/GlassCard";
import AppliedJobTable from "@/components/AppliedJobTable";
import SettingAccount from "@/components/profile/SettingAccount";
import SavedJobTable from "@/components/SavedJobTable";

// Dialogs
import UpdateProfileDialog from "@/components/profile/UpdateProfileDialog";
import UpdateTitleProfileDialog from "@/components/profile/UpdateTitleProfileDialog";
import UpdateWorkExperienceDialog from "@/components/profile/UpdateWorkExperienceDialog";
import UpdateEducationDialog from "@/components/profile/UpdateEducationDialog";
import UpdateCertificationDialog from "@/components/profile/UpdateCertificationDialog";
import UpdateLanguagesDialog from "@/components/profile/UpdateLanguagesDialog";
import UpdateAchievementsDialog from "@/components/profile/UpdateAchievementsDialog";
import UpdateProjectsDialog from "@/components/profile/UpdateProjectsDialog";
import { Button } from "@/components/ui/button";

const Profile = () => {
  useGetAppliedJobs(); // Fetch applied jobs on mount

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const fileInputRef = useRef(null);

  const [tab, setTab] = useState("personal");
  const [openJobsMenu, setOpenJobsMenu] = useState(false);

  // Dialog states grouped
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

  // --- HANDLERS ---

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        // Thường là POST cho upload file
        `${USER_API_END_POINT}/profile/update/photo`, // Kiểm tra lại route backend của bạn
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Avatar updated successfully!");
        // Cập nhật Redux với thông tin user mới từ server trả về
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update picture");
    }
  };

  // Configuration for dynamic sections
  const profileSections = [
    {
      title: "Professional Title",
      icon: User,
      // Wrap title in array to match ProfileSections list logic if needed, or handle as string
      data: user?.profile?.title ? [{ title: user.profile.title }] : [],
      openSetter: (v) => setOpen((prev) => ({ ...prev, title: v })),
      type: "single", // Đánh dấu đây là field đơn
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
      title: "Projects",
      icon: FolderGit2,
      data: user?.profile?.projects || [],
      openSetter: (v) => setOpen((prev) => ({ ...prev, proj: v })),
    },
  ];

  if (!user) return null; // Prevent render if not logged in

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col lg:flex-row gap-10">
        {/* SIDEBAR */}
        <ProfileSidebar
          tab={tab}
          setTab={setTab}
          openJobsMenu={openJobsMenu}
          setOpenJobsMenu={setOpenJobsMenu}
        />

        {/* MAIN CONTENT */}
        <main className="flex-1 space-y-8">
          {tab === "personal" && (
            <>
              {/* Header Info */}
              <ProfileHeader
                user={user}
                onEdit={() => setOpen((prev) => ({ ...prev, profile: true }))}
                // Avatar logic
                fileInputRef={fileInputRef}
                onClickAvatar={() => fileInputRef.current?.click()}
                onAvatarChange={handleAvatarChange}
              />

              {/* Resume Action Card */}
              <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                {/* Background decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-0" />

                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="text-[#6A38C2]" /> Resume & CV
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 max-w-md">
                    Manage your professional profile or create a custom CV using
                    our builder.
                  </p>
                </div>

                <div className="flex gap-3 relative z-10">
                  {/* View Profile Resume */}
                  <Button
                    onClick={() => navigate(`/resume`)}
                    variant="outline"
                    className="rounded-full border-[#6A38C2] text-[#6A38C2] hover:bg-purple-50"
                  >
                    <Eye className="w-4 h-4 mr-2" /> View Profile
                  </Button>

                  {/* Go to CV Builder */}
                  <Button
                    onClick={() => navigate("/cv/home")}
                    className="rounded-full bg-[#6A38C2] hover:bg-[#5b29a0] text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" /> Create Custom CV
                  </Button>
                </div>
              </div>

              {/* Detail Sections */}
              <ProfileSections sections={profileSections} />

              {/* Public Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-400">
                  Public Profile Link:{" "}
                  <a
                    href={`/resume/${user._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#6A38C2] hover:underline font-medium"
                  >
                    {window.location.origin}/resume/{user._id}
                  </a>
                </p>
              </div>
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

      {/* --- MODALS / DIALOGS --- */}
      <UpdateProfileDialog
        open={open.profile}
        setOpen={(v) => setOpen((prev) => ({ ...prev, profile: v }))}
      />
      <UpdateTitleProfileDialog
        open={open.title}
        setOpen={(v) => setOpen((prev) => ({ ...prev, title: v }))}
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
    </div>
  );
};

export default Profile;
