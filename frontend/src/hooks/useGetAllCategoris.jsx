import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "@/redux/categorySlice";
import { CATEGORY_API_END_POINT } from "@/utils/constant";

const useGetAllCategories = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  const [loading, setLoading] = useState(!categories.length);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ✅ Nếu categories đã có → không fetch lại
    if (categories.length > 0) {
      setLoading(false);
      return;
    }

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
  }, [dispatch, categories.length]);

  return { loading, error };
};

export default useGetAllCategories;
