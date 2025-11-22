import { useEffect, useRef } from "react";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant.js";
import { useDispatch } from "react-redux";
import { setCompanies } from "@/redux/companySlice.js";
import { toast } from "sonner";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  const fetchedRef = useRef(false); 

  useEffect(() => {
    if (fetchedRef.current) return; 
    fetchedRef.current = true;

    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        } else {
          toast.error(res.data.message || "Failed to fetch companies");
        }
      } catch (error) {
        console.error("❌ Error fetching companies:", error);
        toast.error(
          error.response?.data?.message || "Failed to load your companies"
        );
      }
    };

    fetchCompanies();
  }, [dispatch]);
};

export default useGetAllCompanies;
