import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  FileText,
  List,
  ShieldCheck,
  BarChart3,
  X,
} from "lucide-react";

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "Users Management", icon: Users },
    { path: "/admin/jobs", label: "Jobs Management", icon: Briefcase },
    { path: "/admin/companies", label: "Companies", icon: Building2 },
    { path: "/admin/applications", label: "Applications", icon: FileText },
    { path: "/admin/career-guides", label: "Career Guides", icon: FileText },
    { path: "/admin/category", label: "Category", icon: List },
    // { path: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="bg-[#6A38C2] p-1.5 rounded-lg">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Admin<span className="text-[#6A38C2]">Portal</span>
          </h1>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden text-gray-500 hover:text-red-500"
        >
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Overview
        </p>

        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                isActive
                  ? "bg-[#6A38C2]/10 text-[#6A38C2]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">
            <p className="font-medium text-gray-900">System Status</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Online
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-50">
        <SidebarContent />
      </aside>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-[70] w-64 h-screen bg-white transition-transform duration-300 md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default AdminSidebar;
