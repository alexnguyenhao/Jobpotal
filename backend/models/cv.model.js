import mongoose from "mongoose";

const cvSchema = new mongoose.Schema(
  {
    // Người sở hữu CV
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
      fullName: { type: String },
      email: { type: String },
      phone: { type: String },
      address: { type: String },
      profilePhoto: { type: String },
      summary: { type: String },
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

    // ————————————————
    // KINH NGHIỆM LÀM VIỆC
    // ————————————————
    workExperience: [
      {
        position: String,
        company: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    skills: [{ type: String }],
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
        title: { type: String, required: true },
        description: { type: String, required: true },
        link: { type: String, required: true },
        technologies: [{ type: String, default: [] }],
      },
    ],
    isPublic: { type: Boolean, default: false },
    shareUrl: { type: String, default: "" },
  },

  { timestamps: true }
);

export const CV = mongoose.model("CV", cvSchema);
