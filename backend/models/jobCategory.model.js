import mongoose from "mongoose";
const JobCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    icon: String,
  },
  {
    timestamps: true,
  }
);

export const JobCategory = mongoose.model("JobCategory", JobCategorySchema);
