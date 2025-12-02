import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    title: { type: String, maxLength: 100, trim: true },
    careerObjective: { type: String, maxLength: 2000, trim: true },
    socialLinks: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    education: [
      {
        school: { type: String, required: true },
        degree: String,
        major: String,
        startDate: { type: Date },
        endDate: { type: Date },
        isCurrent: { type: Boolean, default: false },
        description: { type: String, maxLength: 1000 },
      },
    ],

    workExperience: [
      {
        position: { type: String, required: true },
        company: { type: String, required: true },
        startDate: { type: Date },
        endDate: { type: Date },
        isCurrent: { type: Boolean, default: false },
        description: { type: String, maxLength: 2000 },
      },
    ],

    skills: [
      {
        name: { type: String, required: true },
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
          default: "Intermediate",
        },
      },
    ],

    certifications: [
      {
        name: String,
        organization: String,
        dateIssued: { type: Date },
        expirationDate: { type: Date },
        url: String,
      },
    ],
    languages: [
      {
        language: String,
        proficiency: {
          type: String,
          enum: ["Basic", "Conversational", "Fluent", "Native"],
          default: "Basic",
        },
      },
    ],

    achievements: [
      {
        title: String,
        description: String,
        date: { type: Date },
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        link: String,
        technologies: [String],
        startDate: { type: Date },
        endDate: { type: Date },
        isWorking: { type: Boolean, default: false },
      },
    ],

    operations: [
      {
        title: String,
        position: String,
        description: String,
        startDate: { type: Date },
        endDate: { type: Date },
      },
    ],

    interests: { type: String, maxLength: 500, default: "" },
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
