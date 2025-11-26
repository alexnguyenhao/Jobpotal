import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ModernTemplate from "@/components/cv/templates/ModernTemplate";
import ClassicTemplate from "@/components/cv/templates/ClassicTemplate";
import CreativeTemplate from "@/components/cv/templates/CreativeTemplate";

const TemplatePreviewModal = ({ open, onClose, template }) => {
  const demoData = {
    personalInfo: {
      fullName: "Nguyen Van A",
      email: "nguyenvana@example.com",
      phone: "0987 123 456",
      address: "Hanoi, Vietnam",
      profilePhoto: "/default-avatar.png",
      summary:
        "Front-end Developer with 3 years of experience in building optimized interfaces, specializing in React, Tailwind, and UX.",
    },

    skills: [
      "React.js",
      "JavaScript",
      "TailwindCSS",
      "REST API",
      "UI/UX",
      "Git",
    ],

    education: [
      {
        school: "Hanoi University of Science and Technology",
        degree: "Bachelor's Degree",
        major: "Information Technology",
        startDate: "2018",
        endDate: "2022",
        description:
          "Graduated with Distinction, participated in Programming Club & Hackathons.",
      },
    ],

    workExperience: [
      {
        position: "Front-end Developer",
        company: "FPT Software",
        startDate: "2021",
        endDate: "2023",
        description:
          "Developed user interfaces, optimized page loading speed by 40%, built reusable UI components.",
      },
    ],

    projects: [
      {
        title: "Job Portal UI",
        link: "#",
        description:
          "A job search platform with AI matching and a CV Builder system.",
        technologies: ["React", "TailwindCSS", "Node.js"],
      },
    ],

    certifications: [
      {
        title: "AWS Cloud Practitioner",
        organization: "Amazon Web Services",
        dateIssued: "2022",
      },
    ],

    languages: [
      { language: "Vietnamese", level: "Native" },
      { language: "English", level: "Fluent" },
    ],

    achievements: [
      {
        title: "Outstanding Student Award",
        description: "Top 5% in the IT department",
        year: "2021",
      },
    ],
    operations: [
      {
        title: "Outstanding Student Award",
        description: "Top 5% in the IT department",
        startDate: "2021",
        endDate: "2021",
      },
    ],
    interests: ["Reading", "Swimming", "Gaming", "Traveling", "Cooking"],
  };
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={demoData} />;

      case "classic":
        return <ClassicTemplate data={demoData} />;

      case "creative":
        return <CreativeTemplate data={demoData} />;

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-full h-[95vh] max-w-[95vw] p-0 overflow-hidden rounded-xl"
        style={{ maxWidth: "95vw" }}
      >
        <DialogHeader className="px-6 py-4 shadow">
          <DialogTitle className="text-xl font-bold capitalize">
            {template} Template Preview
          </DialogTitle>
        </DialogHeader>

        <div className="w-full h-full overflow-auto flex justify-center py-10 bg-gray-100">
          <div
            className="origin-top transform scale-[0.8]"
            style={{ width: "794px" }} // A4 width
          >
            {renderTemplate()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewModal;
