import mongoose from "mongoose";
const JobCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  icon: String, // nếu bạn muốn hiển thị biểu tượng
});

export const JobCategory = mongoose.model("JobCategory", JobCategorySchema);
