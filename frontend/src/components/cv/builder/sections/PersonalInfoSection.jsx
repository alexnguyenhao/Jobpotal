import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera, User } from "lucide-react";
import { toast } from "sonner";

const PersonalInfoSection = ({ cvData, updateField }) => {
  const info = cvData.personalInfo;
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    const maxSizeInBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error("File size exceeds the limit of 10MB");
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField("personalInfo.profilePhoto", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div
          className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors group"
          onClick={() => fileInputRef.current?.click()}
        >
          {info.profilePhoto ? (
            <img
              src={info.profilePhoto}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-gray-400" />
          )}
          <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
            <Camera className="w-6 h-6 text-white opacity-80" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-700">Profile Photo</h3>
          <p className="text-xs text-gray-500 mb-2">
            Click on the circle to upload your photo.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Photo
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <Input
          placeholder="Full Name"
          value={info.fullName || ""}
          onChange={(e) => updateField("personalInfo.fullName", e.target.value)}
        />
        <Input
          placeholder="Job Title / Position"
          value={info.position || ""}
          onChange={(e) => updateField("personalInfo.position", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          placeholder="Email"
          value={info.email || ""}
          onChange={(e) => updateField("personalInfo.email", e.target.value)}
        />
        <Input
          placeholder="Phone"
          value={info.phone || ""}
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
          value={info.gender || ""}
          onChange={(e) => updateField("personalInfo.gender", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1">
        <Input
          placeholder="Address"
          value={info.address || ""}
          onChange={(e) => updateField("personalInfo.address", e.target.value)}
        />
      </div>
    </div>
  );
};

export default PersonalInfoSection;
