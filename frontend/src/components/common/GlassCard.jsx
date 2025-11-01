import React from "react";

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

export default GlassCard;
