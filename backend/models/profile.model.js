import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 🔗 liên kết ngược lại với User
      required: true,
      unique: true,
    },
    skills: [{ type: String }],
    resume: { type: String },
    resumeOriginalName: { type: String },
    careerObjective: { type: String },

    workExperience: [
      {
        company: { type: String },
        position: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String },
      },
    ],

    education: [
      {
        school: { type: String },
        degree: { type: String },
        major: { type: String },
        startYear: { type: Number },
        endYear: { type: Number },
      },
    ],

    certifications: [
      {
        name: { type: String },
        organization: { type: String },
        dateIssued: { type: Date },
      },
    ],

    languages: [
      {
        language: { type: String },
        proficiency: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced", "Fluent"],
        },
      },
    ],

    projects: [
      {
        title: { type: String },
        description: { type: String },
        link: { type: String },
        technologies: [{ type: String }],
      },
    ],

    achievements: [{ type: String }],
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
