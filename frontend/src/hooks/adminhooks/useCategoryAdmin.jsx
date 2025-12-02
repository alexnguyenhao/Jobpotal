import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { CATEGORY_API_END_POINT } from "@/utils/constant";
import {
  addCategory,
  updateCategoryInState,
  removeCategory,
  setSingleCategory,
} from "@/redux/categorySlice";

const useCategoryAdmin = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // 1. CREATE CATEGORY
  const createCategory = async (formData) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${CATEGORY_API_END_POINT}/create`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        // Cập nhật Redux ngay lập tức để UI hiện item mới
        dispatch(addCategory(res.data.category));
        return true; // Trả về true để component biết đóng dialog/form
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create category");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 2. UPDATE CATEGORY
  const updateCategory = async (id, formData) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${CATEGORY_API_END_POINT}/update/${id}`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        // Cập nhật Redux item cũ thành mới
        dispatch(updateCategoryInState(res.data.category));
        // Cập nhật luôn singleCategory nếu đang xem chi tiết
        dispatch(setSingleCategory(res.data.category));
        return true;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update category");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 3. DELETE CATEGORY
  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${CATEGORY_API_END_POINT}/delete/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        // Xóa khỏi Redux
        dispatch(removeCategory(id));
        return true;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete category");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useCategoryAdmin;
