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
  // =======================
  // DEMO DATA (FULL)
  // =======================
  const demoData = {
    personalInfo: {
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0987 123 456",
      address: "Hà Nội, Việt Nam",
      profilePhoto: "/default-avatar.png",
      summary:
        "Front-end Developer với 3 năm kinh nghiệm xây dựng giao diện tối ưu, chuyên React, Tailwind và UX.",
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
        school: "Đại học Bách Khoa Hà Nội",
        degree: "Cử nhân",
        major: "Công nghệ thông tin",
        startDate: "2018",
        endDate: "2022",
        description:
          "Tốt nghiệp loại Giỏi, tham gia CLB Lập Trình & Hackathon.",
      },
    ],

    workExperience: [
      {
        position: "Front-end Developer",
        company: "FPT Software",
        startDate: "2021",
        endDate: "2023",
        description:
          "Phát triển giao diện, tối ưu tốc độ tải trang 40%, xây dựng UI component tái sử dụng.",
      },
    ],

    projects: [
      {
        name: "Job Portal UI",
        link: "#",
        description:
          "Nền tảng tìm kiếm việc làm, có AI matching và CV Builder.",
        techStack: ["React", "Node.js", "MongoDB"],
      },
    ],

    certifications: [
      {
        title: "AWS Cloud Practitioner",
        issuer: "Amazon",
        date: "2022",
      },
    ],

    languages: [
      { language: "Tiếng Việt", level: "Native" },
      { language: "Tiếng Anh", level: "Fluent" },
    ],

    achievements: [
      {
        title: "Sinh viên xuất sắc",
        description: "Top 5% khoa CNTT",
        year: "2021",
      },
    ],
  };

  // =======================
  // TEMPLATE RENDER SWITCH
  // =======================
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold capitalize">
            {template} Template Preview
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center py-6">{renderTemplate()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewModal;
