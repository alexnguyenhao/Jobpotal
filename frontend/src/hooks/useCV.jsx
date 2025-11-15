// src/hooks/useCV.jsx
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { CV_API_END_POINT } from "@/utils/constant";
import {
  setCVs,
  setFullCV,
  updatePersonalInfo,
  updateEducation,
  updateWorkExperience,
  updateSkills,
  updateCertifications,
  updateLanguages,
  updateAchievements,
  updateProjects,
  updateStyleConfig,
  updateMeta,
  setLoading,
} from "@/redux/cvSlice";
import { toast } from "sonner";

let saveController = null;

const useCV = () => {
  const dispatch = useDispatch();
  const {
    cvs,
    meta,
    personalInfo,
    education,
    workExperience,
    skills,
    certifications,
    languages,
    achievements,
    projects,
    styleConfig,
    loading,
  } = useSelector((state) => state.cv);

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

  // GET single CV by id: dispatch small updates (not one big setSingleCV)
  const getCV = async (id) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get(`${CV_API_END_POINT}/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const cv = res.data.cv;

        // dispatch parts separately to avoid pushing one huge object
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
        dispatch(
          updateWorkExperience(cv.workExperience ?? cv.workExperience ?? [])
        );
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
  const updateCV = async (id, payload) => {
    try {
      if (saveController) saveController.abort();
      saveController = new AbortController();

      const res = await axios.put(`${CV_API_END_POINT}/${id}`, payload, {
        withCredentials: true,
        signal: saveController.signal,
      });

      if (res.data.success) {
        const cv = res.data.cv;
        if (
          cv.title ||
          cv.template ||
          cv.isPublic !== undefined ||
          cv.shareUrl
        ) {
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
        }

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

        toast.success("CV updated");
        return true;
      }
    } catch (e) {
      if (e.name !== "CanceledError") toast.error("Autosave failed");
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

        dispatch(setLoading(false));
        return cv;
      }
    } catch (e) {
      dispatch(setLoading(false));
      toast.error("Failed to load applicant CV");
      return null;
    }
  };

  return {
    cvs,
    meta,
    personalInfo,
    education,
    workExperience,
    skills,
    certifications,
    languages,
    achievements,
    projects,
    styleConfig,
    loading,
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
