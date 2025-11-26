import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { X } from "lucide-react";

const AdminLayout = () => {
  // State để điều khiển sidebar trên mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 1. SIDEBAR (Desktop) */}
      <AdminSidebar />

      {/* 1.1 SIDEBAR (Mobile Drawer) */}
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Drawer Content */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsSidebarOpen(false)}>
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        {/* Reuse logic menu here or extract menu items to separate config */}
        <AdminSidebar />
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <AdminHeader setIsSidebarOpen={setIsSidebarOpen} />

        {/* Main View - Nơi các trang con (Dashboard, Users...) hiển thị */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
