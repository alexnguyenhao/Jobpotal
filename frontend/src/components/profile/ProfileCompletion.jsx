import React from "react";

const ProfileCompletion = ({ profile }) => {
  if (!profile) return null;

  // Danh sách các trường cần kiểm tra
  const checks = [
    !!profile.title,
    profile.education?.length > 0,
    profile.workExperience?.length > 0,
    profile.certifications?.length > 0,
    profile.languages?.length > 0,
    profile.achievements?.length > 0,
    profile.projects?.length > 0,
    profile.skills?.length > 0,
    profile.operations?.length > 0,
    profile.interests?.length > 0,
    !!profile.careerObjective,
  ];

  // Tính toán %
  const completedCount = checks.filter(Boolean).length;
  const totalCount = checks.length;
  const completion = Math.round((completedCount / totalCount) * 100);

  // Cấu hình màu sắc và thông điệp
  const getStatus = (pct) => {
    if (pct < 40) return { color: "text-red-500", msg: "Start Building" };
    if (pct < 70) return { color: "text-yellow-500", msg: "Keep Going" };
    if (pct < 100) return { color: "text-blue-500", msg: "Almost There" };
    return { color: "text-green-500", msg: "Excellent!" };
  };

  const { color, msg } = getStatus(completion);

  // Cấu hình SVG
  const radius = 18;
  const circumference = 2 * Math.PI * radius; // ~113.097
  const strokeDashoffset = circumference - (completion / 100) * circumference;

  return (
    <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-gray-100 shadow-sm">
      {/* Circular Progress */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="20"
            cy="20"
            r={radius}
            stroke="#e5e7eb" // gray-200
            strokeWidth="3"
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx="20"
            cy="20"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className={`${color} transition-all duration-1000 ease-out`}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" // Bo tròn đầu nét vẽ
          />
        </svg>

        {/* Percentage Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-gray-700">
            {completion}%
          </span>
        </div>
      </div>

      {/* Text Info */}
      <div className="flex flex-col">
        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
          Profile Strength
        </span>
        <span className={`text-sm font-bold ${color}`}>{msg}</span>
      </div>
    </div>
  );
};

export default ProfileCompletion;
