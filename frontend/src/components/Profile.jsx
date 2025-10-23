import React, { useState, useRef } from "react";
import NavBar from "@/components/shared/NavBar.jsx";
import { Avatar, AvatarImage } from "@/components/ui/avatar.js";
import { Button } from "@/components/ui/button.js";
import {
  Contact,
  Mail,
  MapPin,
  User,
  Briefcase,
  Settings,
  Upload,
  Save,
  GraduationCap,
  Award,
  Languages,
  FolderGit2,
  Target,
  Star,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge.js";
import AppliedJobTable from "@/components/AppliedJobTable.jsx";
import UpdateProfileDialog from "@/components/UpdateProfileDialog.jsx";
import UpdateWorkExperienceDialog from "@/components/UpdateWorkExperienceDialog.jsx";
import UpdateEducationDialog from "@/components/UpdateEducationDialog.jsx";
import UpdateCertificationDialog from "@/components/UpdateCertificationDialog.jsx";
import UpdateLanguagesDialog from "@/components/UpdateLanguagesDialog.jsx";
import UpdateAchievementsDialog from "@/components/UpdateAchievementsDialog.jsx";
import UpdateProjectsDialog from "@/components/UpdateProjectsDialog.jsx";
import SettingAccount from "@/components/SettingAccount.jsx";
import { useSelector, useDispatch } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs.jsx";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant.js";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice.js";

const Profile = () => {
  useGetAppliedJobs();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const [tab, setTab] = useState("personal");
  const [openProfile, setOpenProfile] = useState(false);
  const [openWorkExp, setOpenWorkExp] = useState(false);
  const [openEducation, setOpenEducation] = useState(false);
  const [openCertifications, setOpenCertifications] = useState(false);
  const [openLanguages, setOpenLanguages] = useState(false);
  const [openAchievements, setOpenAchievements] = useState(false);
  const [openProjects, setOpenProjects] = useState(false);

  // Upload avatar
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
      toast.success("Profile picture updated successfully!");
      dispatch(setUser({ ...user, profilePhoto: res.data.profilePhoto }));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update picture");
    }
  };

  const handleClickAvatar = () =>
    fileInputRef.current && fileInputRef.current.click();

  // Sidebar menu (with My Jobs submenu)
  const [openJobsMenu, setOpenJobsMenu] = useState(false);
  const sidebarItems = [
    { id: "personal", icon: User, label: "Profile Overview" },
    {
      id: "jobs",
      icon: Briefcase,
      label: "My Jobs",
      subItems: [
        { id: "applied", icon: Briefcase, label: "Applied Jobs" },
        { id: "saved", icon: Save, label: "Saved Jobs" },
      ],
    },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const profileSections = [
    {
      title: "Work Experience",
      icon: Briefcase,
      data: user?.profile?.workExperience,
      openSetter: setOpenWorkExp,
    },
    {
      title: "Education",
      icon: GraduationCap,
      data: user?.profile?.education,
      openSetter: setOpenEducation,
    },
    {
      title: "Certifications",
      icon: Award,
      data: user?.profile?.certifications,
      openSetter: setOpenCertifications,
    },
    {
      title: "Languages",
      icon: Languages,
      data: user?.profile?.languages,
      openSetter: setOpenLanguages,
    },
    {
      title: "Achievements",
      icon: Star,
      data: user?.profile?.achievements,
      openSetter: setOpenAchievements,
    },
    {
      title: "Projects",
      icon: FolderGit2,
      data: user?.profile?.projects,
      openSetter: setOpenProjects,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      <NavBar />

      {/* MAIN WRAPPER */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-2">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              {/* Main item */}
              <button
                onClick={() =>
                  item.subItems
                    ? setOpenJobsMenu(!openJobsMenu)
                    : setTab(item.id)
                }
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl font-semibold transition-all ${
                  tab === item.id ||
                  (item.id === "jobs" && ["applied", "saved"].includes(tab))
                    ? "bg-[#6A38C2]/10 text-[#6A38C2]"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  {item.label}
                </div>
                {item.subItems && (
                  <ChevronRight
                    size={18}
                    className={`transition-transform ${
                      openJobsMenu
                        ? "rotate-90 text-[#6A38C2]"
                        : "text-gray-400"
                    }`}
                  />
                )}
              </button>

              {/* Submenu */}
              {item.subItems && openJobsMenu && (
                <div className="ml-8 mt-2 border-l border-gray-200 pl-3 space-y-1">
                  {item.subItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setTab(sub.id)}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                        tab === sub.id
                          ? "bg-[#6A38C2]/10 text-[#6A38C2]"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <sub.icon size={16} />
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 space-y-8">
          {tab === "personal" && (
            <>
              {/* Profile Header */}
              <GlassCard>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Avatar */}
                  <div className="relative group">
                    <Avatar className="h-36 w-36 border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform">
                      <AvatarImage
                        src={user?.profilePhoto}
                        alt={user?.fullName}
                      />
                    </Avatar>
                    <button
                      onClick={handleClickAvatar}
                      className="absolute bottom-2 right-2 bg-[#6A38C2] text-white p-2 rounded-full shadow-md hover:scale-110 transition-all"
                    >
                      <Upload size={16} />
                    </button>
                    <input
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {user?.fullName}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      {user?.bio || "No bio yet"}
                    </p>
                    <p className="text-gray-500 italic mt-1">
                      {user?.profile?.careerObjective ||
                        "No career objective yet"}
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm text-gray-700">
                      <InfoIcon icon={Mail} text={user?.email} />
                      <InfoIcon
                        icon={Contact}
                        text={user?.phoneNumber || "—"}
                      />
                      <InfoIcon icon={MapPin} text={user?.address || "—"} />
                      <InfoIcon
                        icon={Target}
                        text={user?.role?.toUpperCase()}
                      />
                    </div>

                    <Button
                      onClick={() => setOpenProfile(true)}
                      className="mt-5 bg-[#6A38C2] hover:bg-[#592ba3] text-white rounded-lg px-6 py-2 shadow-md transition-all"
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </GlassCard>

              {/* Skills + Resume */}
              <div className="grid md:grid-cols-2 gap-8">
                <GlassCard title="Skills" icon={Star}>
                  {user?.profile?.skills?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {user.profile.skills.map((skill, i) => (
                        <Badge
                          key={i}
                          className="bg-[#6A38C2]/10 text-[#6A38C2] border border-[#6A38C2]/20"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No skills added yet</p>
                  )}
                </GlassCard>

                <GlassCard title="Resume" icon={Save}>
                  {user?.profile?.resume ? (
                    <a
                      href={user.profile.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-[#6A38C2] font-medium hover:underline"
                    >
                      <Save size={18} /> {user.profile.resumeOriginalName}
                    </a>
                  ) : (
                    <p className="text-gray-500 italic">No resume uploaded</p>
                  )}
                </GlassCard>
              </div>

              {/* Dynamic Sections */}
              {profileSections.map((section, idx) => (
                <GlassCard key={idx} title={section.title} icon={section.icon}>
                  <div className="flex justify-between items-center mb-4">
                    <Button
                      onClick={() => section.openSetter(true)}
                      size="sm"
                      className="bg-[#6A38C2] hover:bg-[#592ba3] text-white"
                    >
                      + Add / Update
                    </Button>
                  </div>
                  {section.data?.length ? (
                    <div className="space-y-4">
                      {section.data.map((item, i) => (
                        <div
                          key={i}
                          className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-all"
                        >
                          <p className="font-semibold text-gray-800">
                            {item.name || item.position || "—"}
                          </p>
                          {item.company && (
                            <p className="text-sm text-gray-600">
                              {item.company}
                            </p>
                          )}
                          {item.description && (
                            <p className="text-gray-700 mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No {section.title.toLowerCase()} yet
                    </p>
                  )}
                </GlassCard>
              ))}
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
      <UpdateProfileDialog open={openProfile} setOpen={setOpenProfile} />
      <UpdateWorkExperienceDialog
        open={openWorkExp}
        setOpen={setOpenWorkExp}
        initialData={user?.profile?.workExperience || []}
      />
      <UpdateEducationDialog
        open={openEducation}
        setOpen={setOpenEducation}
        initialData={user?.profile?.education || []}
      />
      <UpdateCertificationDialog
        open={openCertifications}
        setOpen={setOpenCertifications}
        initialData={user?.profile?.certifications || []}
      />
      <UpdateLanguagesDialog
        open={openLanguages}
        setOpen={setOpenLanguages}
        initialData={user?.profile?.languages || []}
      />
      <UpdateAchievementsDialog
        open={openAchievements}
        setOpen={setOpenAchievements}
        initialData={user?.profile?.achievements || []}
      />
      <UpdateProjectsDialog
        open={openProjects}
        setOpen={setOpenProjects}
        initialData={user?.profile?.projects || []}
      />
    </div>
  );
};

// Reusable UI Components
const GlassCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
    {title && (
      <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4 border-l-4 border-[#6A38C2] pl-3">
        {Icon && <Icon size={20} className="text-[#6A38C2]" />} {title}
      </h2>
    )}
    {children}
  </div>
);

const InfoIcon = ({ icon: Icon, text }) => (
  <span className="flex items-center gap-2 text-sm text-gray-700">
    <Icon size={16} className="text-[#6A38C2]" /> {text}
  </span>
);

export default Profile;
