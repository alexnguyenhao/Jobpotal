import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
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
const Sidebar = ({ cvData, updateField }) => {
  return (
    <div className="w-full md:w-[380px] bg-white border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">CV Editor</h2>
        <p className="text-xs text-gray-500">Customize your resume details</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 pb-20">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {/* 1. Title */}
            <AccordionItem value="title" className="border rounded-lg px-2">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <LayoutTemplate size={18} className="text-[#6A38C2]" />
                  CV Title
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <TitleSection cvData={cvData} updateField={updateField} />
              </AccordionContent>
            </AccordionItem>

            {/* 2. Personal Info */}
            <AccordionItem value="personal" className="border rounded-lg px-2">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <User size={18} className="text-[#6A38C2]" />
                  Personal Information
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <PersonalInfoSection
                  cvData={cvData}
                  updateField={updateField}
                />
              </AccordionContent>
            </AccordionItem>

            {/* 3. Summary */}
            <AccordionItem value="summary" className="border rounded-lg px-2">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <FileText size={18} className="text-[#6A38C2]" />
                  Professional Summary
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <SummarySection cvData={cvData} updateField={updateField} />
              </AccordionContent>
            </AccordionItem>

            {/* 4. Experience */}
            <AccordionItem
              value="experience"
              className="border rounded-lg px-2"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Briefcase size={18} className="text-[#6A38C2]" />
                  Work Experience
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <ExperienceSection cvData={cvData} updateField={updateField} />
              </AccordionContent>
            </AccordionItem>

            {/* 5. Education */}
            <AccordionItem value="education" className="border rounded-lg px-2">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <BookOpen size={18} className="text-[#6A38C2]" />
                  Education
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <EducationSection cvData={cvData} updateField={updateField} />
              </AccordionContent>
            </AccordionItem>

            {/* 6. Skills */}
            <AccordionItem value="skills" className="border rounded-lg px-2">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Code size={18} className="text-[#6A38C2]" />
                  Skills
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <SkillsSection cvData={cvData} updateField={updateField} />
              </AccordionContent>
            </AccordionItem>

            {/* 7. Projects */}
            <AccordionItem value="projects" className="border rounded-lg px-2">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <LayoutTemplate size={18} className="text-[#6A38C2]" />
                  Projects
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <ProjectsSection cvData={cvData} updateField={updateField} />
              </AccordionContent>
            </AccordionItem>

            {/* 8. Certifications */}
            <AccordionItem
              value="certifications"
              className="border rounded-lg px-2"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Award size={18} className="text-[#6A38C2]" />
                  Certifications
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <CertificationsSection
                  cvData={cvData}
                  updateField={updateField}
                />
              </AccordionContent>
            </AccordionItem>

            {/* 9. Languages */}
            <AccordionItem value="languages" className="border rounded-lg px-2">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Languages size={18} className="text-[#6A38C2]" />
                  Languages
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <LanguagesSection cvData={cvData} updateField={updateField} />
              </AccordionContent>
            </AccordionItem>

            {/* 10. Achievements */}
            <AccordionItem
              value="achievements"
              className="border rounded-lg px-2"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Trophy size={18} className="text-[#6A38C2]" />
                  Achievements
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <AchievementsSection
                  cvData={cvData}
                  updateField={updateField}
                />
              </AccordionContent>
            </AccordionItem>

            {/* 11. Operations */}
            <AccordionItem
              value="operations"
              className="border rounded-lg px-2"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <LayoutTemplate size={18} className="text-[#6A38C2]" />
                  Operations
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <OperationsSection cvData={cvData} updateField={updateField} />
              </AccordionContent>
            </AccordionItem>

            {/* 12. Interests */}
            <AccordionItem value="interests" className="border rounded-lg px-2">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <LayoutTemplate size={18} className="text-[#6A38C2]" />
                  Interests
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <InterestsSection cvData={cvData} updateField={updateField} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
