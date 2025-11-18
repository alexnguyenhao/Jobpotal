import React from "react";
import GlassCard from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";
import ProfileSectionItem from "@/components/profile/ProfileSectionItem";
import { Plus, Edit2, FolderOpen } from "lucide-react";

const ProfileSections = ({ sections }) => (
  <div className="space-y-8">
    {sections.map((section, idx) => {
      const hasData = section.data && section.data.length > 0;

      return (
        <GlassCard key={idx} className="relative overflow-hidden">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-[#6A38C2] rounded-lg">
                <section.icon size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                {section.title}
              </h3>
            </div>

            {/* Action Button (Chỉ hiện ở góc nếu ĐÃ có dữ liệu) */}
            {hasData && (
              <Button
                onClick={() => section.openSetter(true)}
                variant="outline"
                size="sm"
                className="h-8 border-gray-200 text-[#6A38C2] hover:bg-purple-50 hover:border-purple-200 transition-all"
              >
                <Edit2 size={14} className="mr-1.5" /> Edit / Add
              </Button>
            )}
          </div>

          {/* Content Section */}
          {hasData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.data.map((item, i) => (
                <ProfileSectionItem key={i} item={item} type={section.title} />
              ))}
            </div>
          ) : (
            /* Empty State - Call to Action */
            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
              <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                <FolderOpen className="text-gray-400 w-6 h-6" />
              </div>
              <p className="text-sm text-gray-500 font-medium mb-4">
                No {section.title.toLowerCase()} added yet.
              </p>
              <Button
                onClick={() => section.openSetter(true)}
                className="bg-white text-[#6A38C2] border border-purple-100 hover:bg-purple-50 shadow-sm"
              >
                <Plus size={16} className="mr-2" /> Add {section.title}
              </Button>
            </div>
          )}
        </GlassCard>
      );
    })}
  </div>
);

export default ProfileSections;
