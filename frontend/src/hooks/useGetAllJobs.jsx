import { useEffect, useRef } from "react";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant.js";
import { useDispatch } from "react-redux";
import { setAllJobs } from "@/redux/jobSlice.js";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const fetchedRef = useRef(false);  

  useEffect(() => {
    if (fetchedRef.current) return;   
    fetchedRef.current = true;        

    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllJobs();
  }, [dispatch]);
};

export default useGetAllJobs;
