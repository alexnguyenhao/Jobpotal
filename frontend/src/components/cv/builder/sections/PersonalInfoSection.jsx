import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label"; // Optional

const PersonalInfoSection = ({ cvData, updateField }) => {
  const info = cvData.personalInfo;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3">
        <Input
          placeholder="Full Name"
          value={info.fullName}
          onChange={(e) => updateField("personalInfo.fullName", e.target.value)}
        />
        <Input
          placeholder="Job Title / Position"
          value={info.position}
          onChange={(e) => updateField("personalInfo.position", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          placeholder="Email"
          value={info.email}
          onChange={(e) => updateField("personalInfo.email", e.target.value)}
        />
        <Input
          placeholder="Phone"
          value={info.phone}
          onChange={(e) => updateField("personalInfo.phone", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          type="date"
          placeholder="Date of Birth"
          value={info.dateOfBirth ? info.dateOfBirth.split("T")[0] : ""}
          onChange={(e) =>
            updateField("personalInfo.dateOfBirth", e.target.value)
          }
        />
        <Input
          placeholder="Gender"
          value={info.gender}
          onChange={(e) => updateField("personalInfo.gender", e.target.value)}
        />
      </div>
    </div>
  );
};

export default PersonalInfoSection;
