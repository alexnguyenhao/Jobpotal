import { useEffect } from "react";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant.js";
import { useDispatch } from "react-redux";
import { setAllJobs } from "@/redux/jobSlice.js";
import { useLocation } from "react-router-dom";

export const useGetJobs = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Nếu có query → gọi /search, ngược lại gọi /get
        const endpoint =
          location.search && location.search.trim() !== ""
            ? `${JOB_API_END_POINT}/search${location.search}`
            : `${JOB_API_END_POINT}/get`;

        const res = await axios.get(endpoint, { withCredentials: true });

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        } else {
          dispatch(setAllJobs([]));
        }
      } catch (error) {
        console.error("❌ Error fetching jobs:", error);
        dispatch(setAllJobs([]));
      }
    };

    fetchJobs();
  }, [location.search, dispatch]);
};
export const getJobByCompany = async (companyId) => {
  try {
    const res = await axios.get(`${JOB_API_END_POINT}/company/${companyId}`, {
      withCredentials: true,
    });
    if (res.data.success) {
      return res.data.jobs;
    }
    return [];
  } catch (error) {
    console.error("❌ Error fetching jobs by company:", error);
    return [];
  }
};
export const getJobByCategory = async (categoryId) => {
  try {
    const res = await axios.get(`${JOB_API_END_POINT}/category/${categoryId}`, {
      withCredentials: true,
    });
    if (res.data.success) {
      return res.data.jobs;
    }
    return [];
  } catch (error) {
    console.error("❌ Error fetching jobs by category:", error);
    return [];
  }
};
