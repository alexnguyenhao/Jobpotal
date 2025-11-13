import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { CV_API_END_POINT } from "@/utils/constant";
import { setCVs, setSingleCV, setLoading } from "@/redux/cvSlice";
import { toast } from "sonner";

let saveController = null;

const useCV = () => {
  const dispatch = useDispatch();
  const { cvs, singleCV, loading } = useSelector((state) => state.cv);

  const fetchMyCVs = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get(`${CV_API_END_POINT}/mine`, {
        withCredentials: true,
      });

      if (res.data.success) dispatch(setCVs(res.data.cvs));
    } catch {
      toast.error("Cannot load CV list");
    } finally {
      dispatch(setLoading(false));
    }
  };
  const createCV = async (payload) => {
    try {
      const res = await axios.post(`${CV_API_END_POINT}/create`, payload, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("CV created");
        return res.data.cv;
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Cannot create CV");
      return null;
    }
  };

  const getCV = async (id) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get(`${CV_API_END_POINT}/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setSingleCV(res.data.cv));
      }
    } catch {
      toast.error("Cannot load CV");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateCV = async (id, payload) => {
    try {
      if (saveController) saveController.abort();
      saveController = new AbortController();

      const res = await axios.put(`${CV_API_END_POINT}/${id}`, payload, {
        withCredentials: true,
        signal: saveController.signal,
      });

      if (res.data.success) {
        dispatch(setSingleCV(res.data.cv));
        toast.success("CV updated");
        return true;
      }
    } catch (e) {
      if (e.name !== "CanceledError") toast.error("Autosave failed");
    }
  };
  const deleteCV = async (id) => {
    try {
      const res = await axios.delete(`${CV_API_END_POINT}/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("CV deleted");
        fetchMyCVs();
      }
    } catch {
      toast.error("Delete failed");
    }
  };
  const shareCV = async (id) => {
    try {
      const res = await axios.put(
        `${CV_API_END_POINT}/share/${id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("CV shared");
        return res.data.url;
      }
    } catch {
      toast.error("Share failed");
    }
  };

  const unShareCV = async (id) => {
    try {
      const res = await axios.put(
        `${CV_API_END_POINT}/unshare/${id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("CV is private now");
        fetchMyCVs();
      }
    } catch {
      toast.error("Unshare failed");
    }
  };
  const getPublicCV = async (shareUrl) => {
    try {
      const res = await axios.get(`${CV_API_END_POINT}/public/${shareUrl}`);
      if (res.data.success) return res.data.cv;
    } catch {
      toast.error("Cannot load public CV");
    }
  };

  return {
    cvs,
    singleCV,
    loading,
    createCV,
    fetchMyCVs,
    getCV,
    updateCV,
    deleteCV,
    shareCV,
    unShareCV,
    getPublicCV,
  };
};

export default useCV;
