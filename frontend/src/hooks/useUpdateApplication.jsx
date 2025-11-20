import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { setAllApplicants } from "@/redux/applicationSlice";

const useUpdateApplication = () => {
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedApplications = applicants.applications.map((app) => {
          if (app._id === id) {
            return { ...app, status: status.toLowerCase() };
          }
          return app;
        });
        dispatch(
          setAllApplicants({
            ...applicants,
            applications: updatedApplications,
          })
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  return { applicants, statusHandler };
};

export default useUpdateApplication;
