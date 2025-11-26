import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constant";
import { setStats } from "@/redux/adminSlice";

const useGetAdminStats = () => {
  const dispatch = useDispatch();
  const { stats } = useSelector((store) => store.admin);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${ADMIN_API_END_POINT}/stats`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setStats(res.data.stats));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dispatch]);

  return {
    stats: stats || {
      totalUsers: 0,
      totalJobs: 0,
      totalCompanies: 0,
      totalApplications: 0,
    },
    loading,
  };
};

export default useGetAdminStats;
