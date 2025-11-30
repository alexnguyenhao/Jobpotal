import axios from "axios";
import { CAREER_GUIDE_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";

import {
  setPublicGuides,
  setMyGuides,
  setSingleGuide,
  setCareerGuideLoading,
  setCareerGuideError,
} from "@/redux/careerGuideSlice";

const API = CAREER_GUIDE_API_END_POINT;

export default function useCareerGuide() {
  const dispatch = useDispatch();
  const { myGuides, publicGuides, singleGuide, loading, error } = useSelector(
    (state) => state.careerGuide
  );

  const startLoading = () => dispatch(setCareerGuideLoading(true));
  const endLoading = () => dispatch(setCareerGuideLoading(false));
  const adminGuidesFetchedRef = useRef(false);
  const fetchPublicGuides = async (params = {}) => {
    try {
      startLoading();
      const res = await axios.get(API, { params });

      if (!res.data.success) {
        dispatch(setCareerGuideError("Failed to load guides"));
        return;
      }

      dispatch(setPublicGuides(res.data.guides || []));
    } catch (err) {
      dispatch(setCareerGuideError("Cannot load guides"));
    } finally {
      endLoading();
    }
  };

  const fetchGuideDetail = async (idOrSlug) => {
    if (!idOrSlug) return;
    try {
      startLoading();
      const res = await axios.get(`${API}/${idOrSlug}`);

      if (!res.data.success) return null;

      dispatch(setSingleGuide(res.data.guide));
      return res.data.guide;
    } catch (err) {
      dispatch(setCareerGuideError("Guide not found"));
      return null;
    } finally {
      endLoading();
    }
  };
  const fetchMyGuides = async () => {
    if (adminGuidesFetchedRef.current) return;
    adminGuidesFetchedRef.current = true;

    try {
      startLoading();
      const res = await axios.get(`${API}/admin`, {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error("Cannot load admin guides");
        return;
      }
      dispatch(setMyGuides(res.data.guides || []));
    } catch (err) {
      toast.error("Cannot load admin guides");
    } finally {
      endLoading();
    }
  };

  const fetchMyGuideById = async (id) => {
    if (!id) return null;

    try {
      startLoading();
      const res = await axios.get(`${API}/admin/${id}`, {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error("Guide not found");
        return null;
      }

      dispatch(setSingleGuide(res.data.guide));
      return res.data.guide;
    } catch (err) {
      toast.error("Cannot load guide detail");
      return null;
    } finally {
      endLoading();
    }
  };

  const createGuide = async (payload) => {
    if (!payload.title || !payload.content) {
      toast.error("Title & content are required");
      return null;
    }

    try {
      startLoading();
      const res = await axios.post(`${API}/admin/create`, payload, {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error(res.data.message || "Create failed");
        return null;
      }

      toast.success("Created successfully");

      adminGuidesFetchedRef.current = false;
      await fetchMyGuides();

      return res.data.guide;
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
      return null;
    } finally {
      endLoading();
    }
  };

  const updateGuide = async (id, payload) => {
    if (!id) return null;

    try {
      startLoading();
      const res = await axios.put(`${API}/admin/${id}`, payload, {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error("Update failed");
        return null;
      }

      toast.success("Updated successfully");

      adminGuidesFetchedRef.current = false;
      dispatch(setSingleGuide(res.data.guide));

      return res.data.guide;
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
      return null;
    } finally {
      endLoading();
    }
  };

  const deleteGuide = async (id) => {
    if (!id) return false;

    try {
      startLoading();

      const res = await axios.delete(`${API}/admin/${id}`, {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error("Delete failed");
        return false;
      }

      toast.success("Deleted successfully");

      dispatch(setMyGuides(myGuides.filter((g) => g._id !== id)));

      return true;
    } catch (err) {
      toast.error("Delete failed");
      return false;
    } finally {
      endLoading();
    }
  };

  return {
    myGuides,
    publicGuides,
    singleGuide,
    loading,
    error,

    fetchPublicGuides,
    fetchGuideDetail,
    fetchMyGuides,
    fetchMyGuideById,
    createGuide,
    updateGuide,
    deleteGuide,
  };
}
