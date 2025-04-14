import { useEffect } from "react";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant.js";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice.js";
const usegetCompanyById = (CompanyId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSingleCompany = async () => {
      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get/${CompanyId}`,
          {
            withCredentials: true,
          }
        );
        console.log(res.data.company);
        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleCompany();
  }, [CompanyId, dispatch]);
};
export default usegetCompanyById;
