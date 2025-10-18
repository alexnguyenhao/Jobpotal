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
      dispatch(
        setUser({
          ...user,
          profile: { ...user.profile, profilePhoto: res.data.profilePhoto },
        })
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update picture");
    }
  };

  const handleClickAvatar = () =>
    fileInputRef.current && fileInputRef.current.click();

  const sidebarItems = [
    { id: "personal", icon: User, label: "Profile Overview" },
    { id: "applied", icon: Briefcase, label: "Applied Jobs" },
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "saved", icon: Save, label: "Saved Jobs" },
  ];

  const profileSections = [
    {
      title: "Work Experience",
      data: user?.profile?.workExperience,
      openSetter: setOpenWorkExp,
      keyName: "workExperience",
    },
    {
      title: "Education",
      data: user?.profile?.education,
      openSetter: setOpenEducation,
      keyName: "education",
    },
    {
      title: "Certifications",
      data: user?.profile?.certifications,
      openSetter: setOpenCertifications,
      keyName: "certifications",
    },
    {
      title: "Languages",
      data: user?.profile?.languages,
      openSetter: setOpenLanguages,
      keyName: "languages",
    },
    {
      title: "Achievements",
      data: user?.profile?.achievements,
      openSetter: setOpenAchievements,
      keyName: "achievements",
    },
    {
      title: "Projects",
      data: user?.profile?.projects,
      openSetter: setOpenProjects,
      keyName: "projects",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        <aside
          className="
    hidden lg:flex lg:flex-col
    w-64 bg-white rounded-2xl shadow-md border border-gray-100
    p-4 gap-2
    sticky top-24
    h-[calc(100vh-7rem)]
    overflow-y-auto
  "
        >
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl w-full font-medium transition-all duration-200 ${
                tab === item.id
                  ? "bg-[#6A38C2]/10 text-[#6A38C2] border border-[#6A38C2]/30"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setTab(item.id)}
            >
              {/* Hiệu ứng thanh tím bên trái khi active */}
              {tab === item.id && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[#6A38C2]" />
              )}
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 space-y-8">
          {tab === "personal" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <Avatar
                    className="h-32 w-32 border-4 border-white shadow-md cursor-pointer hover:scale-105 transition-transform"
                    onClick={handleClickAvatar}
                  >
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt="Profile"
                    />
                  </Avatar>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                  />
                  <button className="absolute bottom-2 right-2 bg-[#6A38C2] text-white p-2 rounded-full shadow hover:bg-[#592ba3] transition">
                    <Upload size={16} />
                  </button>
                </div>

                <div className="flex-1 text-center md:text-left space-y-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user?.fullName}
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {user?.profile?.bio || "No bio yet"}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-700">
                    <span className="flex items-center gap-1">
                      <Mail className="text-[#6A38C2]" size={16} />{" "}
                      {user?.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Contact className="text-[#6A38C2]" size={16} />{" "}
                      {user?.phoneNumber || "—"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="text-[#6A38C2]" size={16} />{" "}
                      {user?.address || "—"}
                    </span>
                  </div>
                  <Button
                    onClick={() => setOpenProfile(true)}
                    className="bg-[#6A38C2] hover:bg-[#592ba3] text-white mt-2"
                  >
                    Update Profile
                  </Button>
                </div>
              </div>

              {/* Skills & Resume */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card title="Skills">
                  <div className="flex flex-wrap gap-2">
                    {user?.profile?.skills?.length ? (
                      user.profile.skills.map((skill, idx) => (
                        <Badge
                          key={idx}
                          className="bg-[#6A38C2]/10 text-[#6A38C2] border border-[#6A38C2]/30"
                        >
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No skills added</p>
                    )}
                  </div>
                </Card>

                <Card title="Resume">
                  {user?.profile?.resume ? (
                    <a
                      href={user.profile.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#6A38C2] hover:underline font-medium"
                    >
                      {user.profile.resumeOriginalName}
                    </a>
                  ) : (
                    <p className="text-gray-500">No resume uploaded</p>
                  )}
                </Card>
              </div>

              {/* Dynamic Sections */}
              {profileSections.map((section) => (
                <Card key={section.title} title={section.title}>
                  <div className="flex justify-between items-center mb-4">
                    <Button
                      onClick={() => section.openSetter(true)}
                      size="sm"
                      className="bg-[#6A38C2] hover:bg-[#592ba3]"
                    >
                      + Add / Update
                    </Button>
                  </div>
                  {section.data?.length ? (
                    <div className="space-y-4">
                      {section.data.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                        >
                          {section.keyName === "workExperience" && (
                            <>
                              <p className="font-semibold text-gray-800">
                                {item.position} - {item.company}
                              </p>
                              <p className="text-sm text-gray-600">
                                {item.startDate?.split("T")[0]} →{" "}
                                {item.endDate?.split("T")[0] || "Present"}
                              </p>
                              <p className="mt-1 text-gray-700">
                                {item.description}
                              </p>
                            </>
                          )}
                          {section.keyName === "education" && (
                            <>
                              <p className="font-semibold text-gray-800">
                                {item.degree} - {item.major}
                              </p>
                              <p className="text-sm text-gray-600">
                                {item.school} ({item.startYear} →{" "}
                                {item.endYear || "Present"})
                              </p>
                            </>
                          )}
                          {section.keyName === "certifications" && (
                            <>
                              <p className="font-semibold text-gray-800">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {item.organization} ({item.dateIssued})
                              </p>
                            </>
                          )}
                          {section.keyName === "languages" && (
                            <Badge>
                              {item.language} ({item.proficiency})
                            </Badge>
                          )}
                          {section.keyName === "achievements" && (
                            <li>{item}</li>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No {section.title.toLowerCase()} added yet
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}

          {tab === "applied" && (
            <Card title="Applied Jobs">
              <AppliedJobTable />
            </Card>
          )}

          {tab === "settings" && <SettingAccount />}
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

// 🧩 Card wrapper component
const Card = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
    {title && (
      <h2 className="text-lg font-semibold text-gray-800 mb-4 border-l-4 border-[#6A38C2] pl-3">
        {title}
      </h2>
    )}
    {children}
  </div>
);

export default Profile;
