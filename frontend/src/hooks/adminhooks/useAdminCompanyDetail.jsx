import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constant";
import { setSingleCompany } from "@/redux/companySlice";
import { toast } from "sonner";

const useAdminCompanyDetail = (companyId) => {
  const dispatch = useDispatch();
  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!companyId) {
      dispatch(setSingleCompany(null));
      return;
    }

    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${ADMIN_API_END_POINT}/company/${companyId}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
        }
      } catch (error) {
        console.log(error);
        toast.error("Error fetching company details");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId, dispatch]);

  return { company: singleCompany, loading };
};

export default useAdminCompanyDetail;
