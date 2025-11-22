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
   * @param {object} singleJob - Object job hiện tại (để cập nhật Redux)
   * @param {object} user - User hiện tại (để cập nhật list applicant)
   * @returns {Promise<boolean>} - Trả về true nếu thành công
   */
  const applyJob = async (jobId, cvId, singleJob, user) => {
    if (!user) {
      navigate("/login");
      return false;
    }

    setIsApplying(true);
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { cvId },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Application submitted!");

        // Cập nhật Redux ngay lập tức để nút bấm chuyển sang "Applied"
        // Thêm user ID vào mảng applications của job hiện tại
        const updatedJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user._id }],
        };
        dispatch(setSingleJob(updatedJob));
        
        return true; // Đánh dấu thành công
      }
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 401) {
        navigate("/login");
      } else {
        toast.error(error?.response?.data?.message || "Application failed");
      }
      return false; // Đánh dấu thất bại
    } finally {
      setIsApplying(false);
    }
  };

  return { applyJob, isApplying };
};

export default useApplyJob;