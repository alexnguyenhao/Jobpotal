import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCategories } from "@/redux/categorySlice";
import { CATEGORY_API_END_POINT } from "@/utils/constant.js";

const useGetAllCategories = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${CATEGORY_API_END_POINT}/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setCategories(res.data.categories));
        } else {
          setError("Failed to load categories");
        }
      } catch (err) {
        console.error("❌ Error fetching categories:", err);
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [dispatch]);

  // ⚠️ QUAN TRỌNG: PHẢI RETURN DỮ LIỆU CHO COMPONENT DÙNG
  return { loading, error };
};

export default useGetAllCategories;
