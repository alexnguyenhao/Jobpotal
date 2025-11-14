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

const Sidebar = ({ cvData, updateField }) => {
  return (
    <div className="w-[360px] bg-white h-full border-r overflow-y-auto p-6">
      <h2 className="text-xl font-bold mb-4">Edit CV</h2>
      <TitleSection cvData={cvData} updateField={updateField} />
      <PersonalInfoSection cvData={cvData} updateField={updateField} />
      <SummarySection cvData={cvData} updateField={updateField} />
      <SkillsSection cvData={cvData} updateField={updateField} />
      <EducationSection cvData={cvData} updateField={updateField} />
      <ExperienceSection cvData={cvData} updateField={updateField} />
      <ProjectsSection cvData={cvData} updateField={updateField} />
      <CertificationsSection cvData={cvData} updateField={updateField} />
      <LanguagesSection cvData={cvData} updateField={updateField} />
      <AchievementsSection cvData={cvData} updateField={updateField} />
    </div>
  );
};

export default Sidebar;
