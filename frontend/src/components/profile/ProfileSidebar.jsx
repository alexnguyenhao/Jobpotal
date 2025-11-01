import React from "react";
import { User, Briefcase, Settings, Save, ChevronRight } from "lucide-react";

const ProfileSidebar = ({ tab, setTab, openJobsMenu, setOpenJobsMenu }) => {
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

  return (
    <aside className="w-full lg:w-72 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-2">
      {items.map((item) => (
        <div key={item.id}>
          <button
            onClick={() =>
              item.sub ? setOpenJobsMenu(!openJobsMenu) : setTab(item.id)
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
            {item.sub && (
              <ChevronRight
                size={18}
                className={`transition-transform ${
                  openJobsMenu ? "rotate-90 text-[#6A38C2]" : "text-gray-400"
                }`}
              />
            )}
          </button>

          {item.sub && openJobsMenu && (
            <div className="ml-8 mt-2 border-l border-gray-200 pl-3 space-y-1">
              {item.sub.map((sub) => (
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
  );
};

export default ProfileSidebar;
