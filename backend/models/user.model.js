import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date, default: null },
    is2FAEnabled: { type: Boolean, default: false },
    twoFAOtp: { type: String, default: null },
    twoFAOtpExpires: { type: Date, default: null },
    phoneNumber: { type: String, trim: true },
    password: { type: String, required: true },
    address: { type: String, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    role: { type: String, enum: ["student", "recruiter"], required: true },
    bio: { type: String },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    profilePhoto: { type: String, default: "" },
    resume: { type: String },
    resumeOriginalName: { type: String },
    // ✅ Liên kết profile
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
