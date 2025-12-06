import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    province: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    ward: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    coords: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  { _id: false }
);

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    professional: { type: [String], required: true },
    description: { type: String, required: true },
    requirements: [String],
    benefits: [String],

    location: {
      type: AddressSchema,
      required: true,
    },

    salary: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, enum: ["VND", "USD"], default: "VND" },
      isNegotiable: { type: Boolean, default: false },
    },

    experienceLevel: { type: String, required: true },
    seniorityLevel: {
      type: String,
      enum: [
        "Intern",
        "Junior",
        "Mid",
        "Senior",
        "Lead",
        "Manager",
        "Director",
        "Executive",
      ],
      required: true,
    },

    jobType: {
      type: [String],
      enum: ["Full-time", "Part-time", "Remote", "Contract", "Internship"],
      required: true,
    },

    numberOfPositions: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
    applicationDeadline: { type: Date, required: true },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobCategory",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
    ],
  },
  { timestamps: true }
);

JobSchema.index({ "location.coords": "2dsphere" });
JobSchema.index({ "location.province": 1, title: "text" });

export const Job = mongoose.model("Job", JobSchema);
