import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const PersonalInfoSection = ({ cvData, updateField }) => {
  const info = cvData.personalInfo;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3">Personal Information</h3>

      <Input
        className="mb-2"
        placeholder="Full Name"
        value={info.fullName}
        onChange={(e) => updateField("personalInfo.fullName", e.target.value)}
      />

      <Input
        className="mb-2"
        placeholder="Email"
        value={info.email}
        onChange={(e) => updateField("personalInfo.email", e.target.value)}
      />

      <Input
        className="mb-2"
        placeholder="Phone"
        value={info.phone}
        onChange={(e) => updateField("personalInfo.phone", e.target.value)}
      />

      <Textarea
        rows={3}
        placeholder="Professional Summary"
        value={info.summary}
        onChange={(e) => updateField("personalInfo.summary", e.target.value)}
      />
    </div>
  );
};

export default PersonalInfoSection;
