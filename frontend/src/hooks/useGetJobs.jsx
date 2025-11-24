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
  if (!companyId) return []; 
  try {
    const res = await axios.get(`${JOB_API_END_POINT}/company/${companyId}`, {
      withCredentials: true,
    });
    return res.data?.jobs || []; 
  } catch (error) {
    console.error(
      "❌ Error fetching jobs by company:",
      error.response?.data?.message || error.message
    );
    return [];
  }
};

export const getJobByCategory = async (categoryId) => {
  if (!categoryId) return []; 
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

export const deleteJobById = async (jobId) => {
  if (!jobId) return false; 
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
