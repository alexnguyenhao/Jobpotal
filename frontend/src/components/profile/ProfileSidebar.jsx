import React, { useEffect } from "react";
import {
  User,
  Briefcase,
  Settings,
  Save,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const ProfileSidebar = ({ tab, setTab, openJobsMenu, setOpenJobsMenu }) => {
  // Danh sách menu
  const items = [
    { id: "personal", icon: User, label: "Profile Overview" },
    {
      id: "jobs",
      icon: Briefcase,
      label: "My Jobs",
      sub: [
        { id: "applied", icon: Briefcase, label: "Applied Jobs" },
        { id: "saved", icon: Save, label: "Saved Jobs" },
      ],
    },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  // 🔥 UX Improvement: Tự động mở menu "My Jobs" nếu đang ở tab con của nó
  useEffect(() => {
    if (["applied", "saved"].includes(tab)) {
      setOpenJobsMenu(true);
    }
  }, [tab, setOpenJobsMenu]);

  return (
    <aside className="w-full lg:w-72 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2 h-fit">
      {items.map((item) => {
        // Kiểm tra xem item cha có đang active không (hoặc con của nó active)
        const isParentActive =
          item.id === tab ||
          (item.sub && item.sub.some((sub) => sub.id === tab));

        return (
          <div key={item.id} className="space-y-1">
            {/* Parent Button */}
            <button
              onClick={() =>
                item.sub ? setOpenJobsMenu(!openJobsMenu) : setTab(item.id)
              }
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${
                isParentActive
                  ? "bg-[#6A38C2]/10 text-[#6A38C2]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Icon đổi màu khi active */}
                <item.icon
                  size={20}
                  className={`${
                    isParentActive
                      ? "text-[#6A38C2]"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                {item.label}
              </div>

              {item.sub && (
                <div
                  className={`text-gray-400 transition-transform duration-300 ${
                    openJobsMenu ? "rotate-90" : ""
                  }`}
                >
                  <ChevronRight size={18} />
                </div>
              )}
            </button>

            {/* Sub Menu */}
            {item.sub && openJobsMenu && (
              <div className="flex flex-col gap-1 pl-4 relative animate-in slide-in-from-top-2 duration-300">
                {/* Đường kẻ dọc trang trí */}
                <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gray-100 rounded-full"></div>

                {item.sub.map((sub) => {
                  const isSubActive = tab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setTab(sub.id)}
                      className={`relative flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all ml-4 ${
                        isSubActive
                          ? "text-[#6A38C2] bg-purple-50"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {/* Dot indicator cho menu con */}
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          isSubActive ? "bg-[#6A38C2]" : "bg-gray-300"
                        }`}
                      ></span>
                      {sub.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
};

export default ProfileSidebar;
