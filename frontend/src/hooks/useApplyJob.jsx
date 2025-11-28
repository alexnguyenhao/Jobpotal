import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";

const useApplyJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = useState(false);

  /**
   * Hàm xử lý ứng tuyển
   * @param {string} jobId - ID của công việc
   * @param {string} cvId - ID của CV (có thể null nếu dùng profile)
   * @param {string} coverLetter - Cover letter
   * @param {object} singleJob - Object job hiện tại (để cập nhật Redux)
   * @param {object} user - User hiện tại (để cập nhật list applicant)
   * @returns {Promise<boolean>} - Trả về true nếu thành công
   */
  const applyJob = async (jobId, cvId, coverLetter, singleJob, user) => {
    if (!user) {
      navigate("/login");
      return false;
    }

    setIsApplying(true);
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { cvId, coverLetter },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Application submitted!");
        const updatedJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user._id }],
        };
        dispatch(setSingleJob(updatedJob));

        return true;
      }
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 401) {
        navigate("/login");
      } else {
        toast.error(error?.response?.data?.message || "Application failed");
      }
      return false;
    } finally {
      setIsApplying(false);
    }
  };

  return { applyJob, isApplying };
};

export default useApplyJob;
