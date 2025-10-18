import { JobCategory } from "../models/jobCategory.model.js";

// Tạo mới category
export const createJobCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "Name is required", success: false });
    }
    const exist = await JobCategory.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
    if (exist) {
      return res
        .status(400)
        .json({ message: "Category already exists", success: false });
    }
    const category = await JobCategory.create({ name, description, icon });
    res
      .status(201)
      .json({ message: "Created successfully", category, success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Lấy tất cả category
export const getAllJobCategories = async (req, res) => {
  try {
    const categories = await JobCategory.find();
    res.status(200).json({ categories, success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Lấy 1 category theo id
export const getJobCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await JobCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }
    res.status(200).json({ category, success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Cập nhật category
export const updateJobCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon } = req.body;
    const category = await JobCategory.findByIdAndUpdate(
      id,
      { name, description, icon },
      { new: true }
    );
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }
    res
      .status(200)
      .json({ message: "Updated successfully", category, success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Xóa category
export const deleteJobCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await JobCategory.findByIdAndDelete(id);
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }
    res.status(200).json({ message: "Deleted successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
