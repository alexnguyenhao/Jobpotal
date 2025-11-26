import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    taxCode: { type: String, trim: true },
    description: { type: String },
    website: { type: String, default: "", trim: true },
    location: { type: String },
    logo: { type: String },
    industry: { type: String, trim: true },
    foundedYear: { type: Number },
    employeeCount: { type: Number, default: 0 },
    phone: { type: String },
    email: { type: String, lowercase: true, trim: true },
    socials: {
      facebook: String,
    },
    tags: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
export const Company = mongoose.model("Company", companySchema);
