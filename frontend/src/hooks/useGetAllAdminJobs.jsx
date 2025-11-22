import { useEffect, useRef } from "react";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant.js";
import { useDispatch } from "react-redux";
import { setAllAdminJobs } from "@/redux/jobSlice.js";

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
  const fetchedRef = useRef(false); 

  useEffect(() => {
    if (fetchedRef.current) return; 
    fetchedRef.current = true;       

    const fetchAllAdminJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/admin/get`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setAllAdminJobs(res.data.jobs));
        }
      } catch (error) {
        console.log("❌ Error fetching admin jobs:", error);
      }
    };

    fetchAllAdminJobs();
  }, [dispatch]);
};

export default useGetAllAdminJobs;
