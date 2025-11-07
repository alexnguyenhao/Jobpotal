import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant.js";
import { useEffect } from "react";
import { setSavedJobs, addSavedJob, removeSavedJob } from "@/redux/jobSlice.js";

const useSavedJobs = (autoFetch = true) => {
  const dispatch = useDispatch();
  const { savedJobs } = useSelector((store) => store.job);

  const fetchSavedJobs = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/saved`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setSavedJobs(res.data.savedJobs));
      }
    } catch (err) {
      console.error("❌ Fetch saved jobs error:", err);
    }
  };

  const saveJob = async (jobId) => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/save/${jobId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(addSavedJob(jobId));
      }
    } catch (err) {
      console.error("❌ Save job error:", err);
    }
  };

  const unsaveJob = async (jobId) => {
    try {
      const res = await axios.delete(`${USER_API_END_POINT}/unsave/${jobId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(removeSavedJob(jobId));
      }
    } catch (err) {
      console.error("❌ Unsave job error:", err);
    }
  };

  useEffect(() => {
    if (autoFetch) fetchSavedJobs();
  }, []);

  return { savedJobs, saveJob, unsaveJob, fetchSavedJobs };
};

export default useSavedJobs;
