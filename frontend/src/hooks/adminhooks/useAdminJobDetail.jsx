import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { toast } from "sonner";

const useAdminJobDetail = (jobId) => {
  const dispatch = useDispatch();
  const { singleJob } = useSelector((store) => store.job);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!jobId) {
      dispatch(setSingleJob(null));
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${ADMIN_API_END_POINT}/job/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
        }
      } catch (error) {
        console.log(error);
        toast.error("Error fetching job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, dispatch]);
  return { job: singleJob, loading };
};

export default useAdminJobDetail;
