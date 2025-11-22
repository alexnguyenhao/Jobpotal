import { useEffect } from "react";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant.js";
import { useDispatch } from "react-redux";
import { setAllJobs } from "@/redux/jobSlice.js";
import { useLocation } from "react-router-dom";
import { useRef } from "react";

// --- 1. MAIN HOOK: useGetJobs ---
// Automatically fetches jobs based on URL query params (for search/filter)
export const useGetJobs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
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

    // 🚀 FIX: tránh fetch lặp khi mount / redirect / login
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchJobs();
    }

  }, [location.search, dispatch]);
};
export const getJobByCompany = async (companyId) => {
  if (!companyId) return []; // Safety check
  try {
    const res = await axios.get(`${JOB_API_END_POINT}/company/${companyId}`, {
      withCredentials: true,
    });
    return res.data?.jobs || []; // Optional chaining for safety
  } catch (error) {
    console.error(
      "❌ Error fetching jobs by company:",
      error.response?.data?.message || error.message
    );
    return [];
  }
};

// ✅ Get Jobs by Category ID
export const getJobByCategory = async (categoryId) => {
  if (!categoryId) return []; // Safety check
  try {
    const res = await axios.get(`${JOB_API_END_POINT}/category/${categoryId}`, {
      withCredentials: true,
    });
    return res.data?.jobs || [];
  } catch (error) {
    console.error(
      "❌ Error fetching jobs by category:",
      error.response?.data?.message || error.message
    );
    return [];
  }
};

// ✅ Delete Job by ID
export const deleteJobById = async (jobId) => {
  if (!jobId) return false; // Safety check
  try {
    const res = await axios.delete(`${JOB_API_END_POINT}/${jobId}`, {
      withCredentials: true,
    });
    return res.data?.success || false;
  } catch (error) {
    console.error("❌ Error deleting job:", error);
    return false;
  }
};
