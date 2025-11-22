import { useEffect } from "react";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant.js";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice.js";

/**
 * Hook lấy thông tin công ty theo ID.
 * @param {string} companyId - ID công ty.
 * @param {boolean} isRecruiter - Nếu true → gọi API dành cho recruiter (/admin/:id)
 */
const usegetCompanyById = (companyId, isRecruiter = false) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSingleCompany = async () => {
      if (!companyId) return;

      try {
        const endpoint = isRecruiter
          ? `${COMPANY_API_END_POINT}/admin/${companyId}`
          : `${COMPANY_API_END_POINT}/${companyId}`;

        const res = await axios.get(endpoint, { withCredentials: true });

        if (res.data.success && res.data.company) {
          console.log("✅ Company fetched:", res.data.company);
          dispatch(setSingleCompany(res.data.company));
        }
      } catch (error) {
        console.error(
          "❌ Error fetching company:",
          error.response?.data || error
        );
      }
    };

    fetchSingleCompany();
  }, [companyId, isRecruiter, dispatch]);
};

export default usegetCompanyById;
