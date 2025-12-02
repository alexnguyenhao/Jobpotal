import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSingleCategory } from "@/redux/categorySlice";
import { CATEGORY_API_END_POINT } from "@/utils/constant";

// Hook nhận vào ID của category cần lấy
const useGetSingleCategory = (categoryId) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Nếu không có ID thì không gọi API
    if (!categoryId) return;

    const fetchSingleCategory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${CATEGORY_API_END_POINT}/get/${categoryId}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setSingleCategory(res.data.category));
        }
      } catch (err) {
        console.error("❌ Error fetching single category:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleCategory();
  }, [categoryId, dispatch]);

  return { loading };
};

export default useGetSingleCategory;
