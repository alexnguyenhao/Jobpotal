import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constant";
import { setApplications } from "@/redux/adminSlice";
import { toast } from "sonner";

const useAdminApplications = () => {
  const dispatch = useDispatch();
  const { applications } = useSelector((store) => store.admin);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${ADMIN_API_END_POINT}/all-applications`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setApplications(res.data.applications));
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [dispatch]);

  return { applications, loading };
};

export default useAdminApplications;
