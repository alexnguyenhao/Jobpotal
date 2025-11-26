import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCompanies, updateCompanyInStore } from "@/redux/adminSlice";
import { ADMIN_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const useAdminCompanies = () => {
  const dispatch = useDispatch();
  const { companies } = useSelector((store) => store.admin);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${ADMIN_API_END_POINT}/all-companies`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [dispatch]);

  const toggleCompanyStatus = async (companyId) => {
    try {
      const res = await axios.put(
        `${ADMIN_API_END_POINT}/active-company/${companyId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(updateCompanyInStore(res.data.company));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi cập nhật");
    }
  };

  return { companies, loading, toggleCompanyStatus };
};

export default useAdminCompanies;
