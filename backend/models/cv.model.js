import mongoose from "mongoose";

const cvSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, default: "My CV" },

    template: {
      type: String,
      enum: ["modern", "classic", "creative"],
      default: "modern",
    },

    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      dateOfBirth: String,
      gender: String,
      profilePhoto: String,
      position: String,
      summary: String,
    },

    education: [
      {
        school: String,
        degree: String,
        major: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    workExperience: [
      {
        position: String,
        company: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    skills: [String],

    certifications: [
      {
        name: String,
        organization: String,
        dateIssued: String,
      },
    ],

    languages: [
      {
        language: String,
        proficiency: String,
      },
    ],

    achievements: [
      {
        title: String,
        description: String,
        year: String,
      },
    ],

    projects: [
      {
        title: String,
        description: String,
        link: String,
        technologies: [String],
      },
    ],
    styleConfig: {
      fontFamily: { type: String, default: "font-sans" },
      fontSizeClass: { type: String, default: "text-base" },
      primaryColor: { type: String, default: "#4D6CFF" },
      backgroundColor: { type: String, default: "#ffffff" },
      textColor: { type: String, default: "#111" },
      spacing: { type: String, default: "normal" }, // tight / normal / wide
      borderRadius: { type: Number, default: 12 },
      shadowLevel: { type: Number, default: 1 }, // 0 - 3
    },

    isPublic: { type: Boolean, default: false },
    shareUrl: { type: String, default: "" },
  },

  { timestamps: true }
);

export const CV = mongoose.model("CV", cvSchema);
