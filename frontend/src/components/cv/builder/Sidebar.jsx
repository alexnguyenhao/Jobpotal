import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  User,
  BookOpen,
  Briefcase,
  Award,
  Code,
  Languages,
  Trophy,
  FileText,
  LayoutTemplate,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import PersonalInfoSection from "./sections/PersonalInfoSection";
import SummarySection from "./sections/SummarySection";
import SkillsSection from "./sections/SkillsSection";
import EducationSection from "./sections/EducationSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectsSection from "./sections/ProjectsSection";
import CertificationsSection from "./sections/CertificationsSection";
import LanguagesSection from "./sections/LanguagesSection";
import AchievementsSection from "./sections/AchievementsSection";
import TitleSection from "./sections/TitleSection";
import OperationsSection from "./sections/OperationsSection";
import InterestsSection from "./sections/InterestsSection";

const Sidebar = ({ cvData, updateField, isCollapsed, onToggle }) => {
  const [activeSection, setActiveSection] = useState("title");

  const sections = [
    {
      id: "title",
      title: "CV Title",
      icon: LayoutTemplate,
      component: TitleSection,
    },
    {
      id: "personal",
      title: "Personal Information",
      icon: User,
      component: PersonalInfoSection,
    },
    {
      id: "summary",
      title: "Professional Summary",
      icon: FileText,
      component: SummarySection,
    },
    {
      id: "experience",
      title: "Work Experience",
      icon: Briefcase,
      component: ExperienceSection,
    },
    {
      id: "education",
      title: "Education",
      icon: BookOpen,
      component: EducationSection,
    },
    {
      id: "skills",
      title: "Skills",
      icon: Code,
      component: SkillsSection,
    },
    {
      id: "projects",
      title: "Projects",
      icon: LayoutTemplate,
      component: ProjectsSection,
    },
    {
      id: "certifications",
      title: "Certifications",
      icon: Award,
      component: CertificationsSection,
    },
    {
      id: "languages",
      title: "Languages",
      icon: Languages,
      component: LanguagesSection,
    },
    {
      id: "achievements",
      title: "Achievements",
      icon: Trophy,
      component: AchievementsSection,
    },
    {
      id: "operations",
      title: "Operations",
      icon: LayoutTemplate,
      component: OperationsSection,
    },
    {
      id: "interests",
      title: "Interests",
      icon: LayoutTemplate,
      component: InterestsSection,
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <div
        className={`p-4 border-b flex items-center ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!isCollapsed && (
          <div className="overflow-hidden whitespace-nowrap">
            <h2 className="text-xl font-bold text-gray-800">CV Editor</h2>
            <p className="text-xs text-gray-500">Customize your resume</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-gray-500 hover:text-[#6A38C2] shrink-0"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-3 py-4">
            {sections.map(({ id, title, icon: Icon }) => (
              <Button
                key={id}
                variant="ghost"
                size="icon"
                className={`rounded-xl w-10 h-10 transition-all ${
                  activeSection === id
                    ? "bg-[#6A38C2] text-white shadow-md hover:bg-[#5b30a6] hover:text-white"
                    : "text-gray-500 hover:bg-purple-50 hover:text-[#6A38C2]"
                }`}
                title={title}
                onClick={() => {
                  onToggle();
                  setActiveSection(id);
                }}
              >
                <Icon size={20} />
              </Button>
            ))}
          </div>
        ) : (
          <div className="p-4 pb-20">
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-2"
              value={activeSection}
              onValueChange={setActiveSection}
            >
              {sections.map(
                ({ id, title, icon: Icon, component: Component }) => (
                  <AccordionItem
                    key={id}
                    value={id}
                    className="border rounded-lg px-2 bg-white data-[state=open]:border-[#6A38C2]/30 data-[state=open]:shadow-sm transition-all"
                  >
                    <AccordionTrigger className="hover:no-underline py-3 px-1 group">
                      <div className="flex items-center gap-3 text-sm font-semibold">
                        <div
                          className={`p-1.5 rounded-md transition-colors ${
                            activeSection === id
                              ? "bg-[#6A38C2]/10 text-[#6A38C2]"
                              : "text-gray-400 group-hover:text-[#6A38C2] group-hover:bg-[#6A38C2]/5"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <span
                          className={`transition-colors ${
                            activeSection === id
                              ? "text-[#6A38C2]"
                              : "text-gray-700"
                          }`}
                        >
                          {title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 px-1 pb-4">
                      <Component cvData={cvData} updateField={updateField} />
                    </AccordionContent>
                  </AccordionItem>
                )
              )}
            </Accordion>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
