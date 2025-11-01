import React from "react";
import GlassCard from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";
import ProfileSectionItem from "@/components/profile/ProfileSectionItem";

const ProfileSections = ({ sections }) => (
  <>
    {sections.map((section, idx) => (
      <GlassCard key={idx} title={section.title} icon={section.icon}>
        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={() => section.openSetter(true)}
            size="sm"
            className="bg-[#6A38C2] hover:bg-[#592ba3] text-white"
          >
            + Add / Update
          </Button>
        </div>
        {section.data?.length ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {section.data.map((item, i) => (
              <ProfileSectionItem key={i} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No {section.title.toLowerCase()} yet
          </p>
        )}
      </GlassCard>
    ))}
  </>
);

export default ProfileSections;
