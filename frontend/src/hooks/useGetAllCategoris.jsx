import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCategories } from "@/redux/categorySlice";
import { CATEGORY_API_END_POINT } from "@/utils/constant.js";

const useGetAllCategories = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${CATEGORY_API_END_POINT}/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setCategories(res.data.categories));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, [dispatch]);
};

export default useGetAllCategories;
