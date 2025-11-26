import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constant";
import { setJobs, updateJobInStore } from "@/redux/adminSlice";
import { toast } from "sonner";

const useAdminJob = () => {
  const dispatch = useDispatch();
  const { jobs } = useSelector((store) => store.admin);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${ADMIN_API_END_POINT}/all-jobs`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setJobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [dispatch]);
  const toggleJobStatus = async (jobId) => {
    try {
      const res = await axios.put(
        `${ADMIN_API_END_POINT}/update-status-job/${jobId}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(updateJobInStore(res.data.job));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Internal Server Error");
    }
  };
  return { jobs, loading, toggleJobStatus };
};

export default useAdminJob;
