import React from "react";

const ProfileCompletion = ({ profile }) => {
  if (!profile) return null;

  const checks = [
    !!profile.title,
    profile.education?.length,
    profile.workExperience?.length,
    profile.certifications?.length,
    profile.languages?.length,
    profile.achievements?.length,
    profile.projects?.length,
    profile.skills?.length,
    !!profile.careerObjective,
  ];
  const completion = Math.round(
    (checks.filter(Boolean).length / checks.length) * 100
  );
  const color =
    completion < 40
      ? "text-red-500"
      : completion < 70
      ? "text-yellow-500"
      : completion < 90
      ? "text-blue-500"
      : "text-green-500";

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="#e5e7eb"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className={`${color} transition-all duration-700`}
            strokeDasharray={`${(completion / 100) * 125.6}, 125.6`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
          {completion}%
        </span>
      </div>
      <p className="text-sm text-gray-600">
        <b>{completion}%</b> Complete
      </p>
    </div>
  );
};

export default ProfileCompletion;
