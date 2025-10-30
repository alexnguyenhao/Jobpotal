import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <NavBar />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer luôn ở cuối */}
      <Footer />
    </div>
  );
};

export default Layout;
