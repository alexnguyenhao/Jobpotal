// src/hooks/useCV.jsx
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { CV_API_END_POINT } from "@/utils/constant";
import {
  setCVs,
  updateMeta,
  updatePersonalInfo,
  updateEducation,
  updateWorkExperience,
  updateSkills,
  updateCertifications,
  updateLanguages,
  updateAchievements,
  updateProjects,
  updateStyleConfig,
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
  const getCV = async (id) => {
    try {
      dispatch(setLoading(true));

      const res = await axios.get(`${CV_API_END_POINT}/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const cv = res.data.cv;

        dispatch(
          updateMeta({
            _id: cv._id ?? cv.id,
            title: cv.title,
            template: cv.template,
            isPublic: cv.isPublic,
            shareUrl: cv.shareUrl,
            createdAt: cv.createdAt,
            updatedAt: cv.updatedAt,
            user: cv.user,
          })
        );

        dispatch(updatePersonalInfo(cv.personalInfo ?? {}));
        dispatch(updateEducation(cv.education ?? []));
        dispatch(updateWorkExperience(cv.workExperience ?? []));
        dispatch(updateSkills(cv.skills ?? []));
        dispatch(updateCertifications(cv.certifications ?? []));
        dispatch(updateLanguages(cv.languages ?? []));
        dispatch(updateAchievements(cv.achievements ?? []));
        dispatch(updateProjects(cv.projects ?? []));
        dispatch(updateStyleConfig(cv.styleConfig ?? {}));
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
        const cv = res.data.cv;

        dispatch(
          updateMeta({
            _id: cv._id ?? cv.id,
            title: cv.title,
            template: cv.template,
            isPublic: cv.isPublic,
            shareUrl: cv.shareUrl,
            createdAt: cv.createdAt,
            updatedAt: cv.updatedAt,
            user: cv.user,
          })
        );

        if (cv.personalInfo) dispatch(updatePersonalInfo(cv.personalInfo));
        if (cv.education) dispatch(updateEducation(cv.education));
        if (cv.workExperience)
          dispatch(updateWorkExperience(cv.workExperience));
        if (cv.skills) dispatch(updateSkills(cv.skills));
        if (cv.certifications)
          dispatch(updateCertifications(cv.certifications));
        if (cv.languages) dispatch(updateLanguages(cv.languages));
        if (cv.achievements) dispatch(updateAchievements(cv.achievements));
        if (cv.projects) dispatch(updateProjects(cv.projects));
        if (cv.styleConfig) dispatch(updateStyleConfig(cv.styleConfig));

        if (showToast) toast.success("CV updated");
        return true;
      }
    } catch (e) {
      const isCanceled =
        axios.isCancel?.(e) ||
        e.code === "ERR_CANCELED" ||
        e.name === "CanceledError";

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
        toast.success("CV is now private");
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
        const cv = res.data.cv;

        dispatch(
          updateMeta({
            _id: cv._id ?? cv.id,
            title: cv.title,
            template: cv.template,
            isPublic: cv.isPublic,
            shareUrl: cv.shareUrl,
            createdAt: cv.createdAt,
            updatedAt: cv.updatedAt,
            user: cv.user,
          })
        );

        dispatch(updatePersonalInfo(cv.personalInfo ?? {}));
        dispatch(updateEducation(cv.education ?? []));
        dispatch(updateWorkExperience(cv.workExperience ?? []));
        dispatch(updateSkills(cv.skills ?? []));
        dispatch(updateCertifications(cv.certifications ?? []));
        dispatch(updateLanguages(cv.languages ?? []));
        dispatch(updateAchievements(cv.achievements ?? []));
        dispatch(updateProjects(cv.projects ?? []));
        dispatch(updateStyleConfig(cv.styleConfig ?? {}));

        return cv;
      }
    } catch {
      toast.error("Failed to load applicant CV");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
  return {
    ...state, // cvs, meta, personalInfo, ...
    createCV,
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
