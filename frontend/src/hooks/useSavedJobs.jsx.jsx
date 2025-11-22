import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant.js";
import { useEffect, useRef } from "react";
import { setSavedJobs, addSavedJob, removeSavedJob } from "@/redux/jobSlice.js";

const useSavedJobs = (autoFetch = true) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { savedJobs } = useSelector((store) => store.job);

  const hasFetched = useRef(false);

  const fetchSavedJobs = async () => {
    if (!user) return;
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
        await fetchSavedJobs(); // 🔥 sync lại với server
      }
    } catch (err) {
      console.error("❌ Save job error:", err);
    }
  };

  const unsaveJob = async (jobId) => {
    try {
      const res = await axios.delete(
        `${USER_API_END_POINT}/unsave/${jobId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(removeSavedJob(jobId));
        await fetchSavedJobs(); // 🔥 sync lại với server
      }
    } catch (err) {
      console.error("❌ Unsave job error:", err);
    }
  };

  useEffect(() => {
    if (!autoFetch) return;
    if (!user) return;
    if (hasFetched.current) return;

    hasFetched.current = true;
    fetchSavedJobs();
  }, [user]);

  return { savedJobs, saveJob, unsaveJob, fetchSavedJobs };
};

export default useSavedJobs;
