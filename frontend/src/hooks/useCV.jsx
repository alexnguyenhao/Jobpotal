import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { CV_API_END_POINT } from "@/utils/constant";
import {
  setCVs,
  setFullCV,
  updateMeta,
  updateLocalCVState,
  setLoading,
} from "@/redux/cvSlice";
import { toast } from "sonner";

const useCV = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.cv);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const abortRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (abortRef.current) {
        try {
          abortRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const createAbortSignal = () => {
    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch {}
    }
    abortRef.current = new AbortController();
    return abortRef.current.signal;
  };

  const fetchMyCVs = async () => {
    if (!isAuthenticated) return;
    try {
      dispatch(setLoading(true));
      const res = await axios.get(`${CV_API_END_POINT}/mine`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setCVs(res.data.cvs));
      }
    } catch {
      toast.error("Cannot load CV list");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createCV = async (payload) => {
    if (!isAuthenticated) {
      toast.error("Please login to create CV");
      return null;
    }
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

  const createCVByUpload = async (file) => {
    if (!isAuthenticated) return;
    if (!file) {
      toast.error("No file selected");
      return;
    }

    try {
      dispatch(setLoading(true));
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${CV_API_END_POINT}/upload`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("CV uploaded successfully");
        return res.data.cv;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const uploadAvatar = async (file) => {
    if (!file) return null;
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${CV_API_END_POINT}/upload-avatar`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        dispatch(
          updateLocalCVState({
            path: "personalInfo.profilePhoto",
            value: res.data.url,
          })
        );
        return res.data.url;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload avatar");
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
        dispatch(setFullCV(res.data.cv));
      }
    } catch {
      toast.error("Cannot load CV");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateCV = async (id, payload, { showToast = false } = {}) => {
    try {
      const signal = createAbortSignal();
      const res = await axios.put(`${CV_API_END_POINT}/${id}`, payload, {
        withCredentials: true,
        signal,
      });

      if (!mountedRef.current) return false;

      if (res.data.success) {
        dispatch(setFullCV(res.data.cv));
        if (showToast) toast.success("CV updated");
        return true;
      }
    } catch (e) {
      const isCanceled = axios.isCancel?.(e) || e.code === "ERR_CANCELED";
      if (!isCanceled) toast.error("Autosave failed");
      return false;
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
        return true;
      }
    } catch {
      toast.error("Delete failed");
      return false;
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
        dispatch(
          updateMeta({
            ...state.meta,
            isPublic: true,
            shareUrl: res.data.url.split("/").pop(),
          })
        );
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
        toast.success("CV is now private");
        dispatch(
          updateMeta({
            ...state.meta,
            isPublic: false,
            shareUrl: "",
          })
        );
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

  const getCVForRecruiter = async (id) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get(`${CV_API_END_POINT}/view/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setFullCV(res.data.cv));
        return res.data.cv;
      }
    } catch {
      toast.error("Failed to load applicant CV");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    ...state,
    createCV,
    createCVByUpload,
    uploadAvatar,
    fetchMyCVs,
    getCV,
    updateCV,
    deleteCV,
    shareCV,
    unShareCV,
    getPublicCV,
    getCVForRecruiter,
  };
};

export default useCV;
