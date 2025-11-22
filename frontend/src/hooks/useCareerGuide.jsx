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

  const { myGuides, publicGuides, singleGuide, loading, error } =
    useSelector((state) => state.careerGuide);

  const startLoading = () => dispatch(setCareerGuideLoading(true));
  const endLoading = () => dispatch(setCareerGuideLoading(false));

  // ❗ FETCH GUARD — chống fetch nhiều lần
  const myGuidesFetchedRef = useRef(false);
  const publicFetchedRef = useRef(false);

  // ================================
  // PUBLIC GUIDES
  // ================================
  const fetchPublicGuides = async (params = {}) => {
    if (publicFetchedRef.current) return; // 👈 chỉ fetch 1 lần
    publicFetchedRef.current = true;

    try {
      startLoading();
      const res = await axios.get(API, { params });

      if (!res.data.success) {
        dispatch(setCareerGuideError("Failed to load guides"));
        return;
      }
      dispatch(setPublicGuides(res.data.guides || []));
    } catch {
      dispatch(setCareerGuideError("Cannot load guides"));
    } finally {
      endLoading();
    }
  };

  // ================================
  // PUBLIC DETAIL
  // ================================
  const fetchGuideDetail = async (idOrSlug) => {
    if (!idOrSlug) return;
    try {
      startLoading();
      const res = await axios.get(`${API}/${idOrSlug}`);

      if (!res.data.success) return null;

      dispatch(setSingleGuide(res.data.guide));
      return res.data.guide;
    } catch {
      dispatch(setCareerGuideError("Guide not found"));
      return null;
    } finally {
      endLoading();
    }
  };

  // ================================
  // MY GUIDES
  // ================================
  const fetchMyGuides = async () => {
    if (myGuidesFetchedRef.current) return; // 👈 chống fetch loop
    myGuidesFetchedRef.current = true;

    try {
      startLoading();
      const res = await axios.get(`${API}/mine`, {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error("Cannot load your guides");
        return;
      }

      dispatch(setMyGuides(res.data.guides || []));
    } catch {
      toast.error("Cannot load your guides");
    } finally {
      endLoading();
    }
  };

  // ================================
  // GET MY GUIDE BY ID
  // ================================
  const fetchMyGuideById = async (id) => {
    if (!id) return null;

    try {
      startLoading();
      const res = await axios.get(`${API}/mine/${id}`, {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error("Guide not found or no permission");
        return null;
      }

      dispatch(setSingleGuide(res.data.guide));
      return res.data.guide;
    } catch {
      toast.error("Cannot load guide detail");
      return null;
    } finally {
      endLoading();
    }
  };

  // ================================
  // CREATE
  // ================================
  const createGuide = async (payload) => {
    if (!payload.title || !payload.content) {
      toast.error("Title & content are required");
      return null;
    }

    try {
      startLoading();
      const res = await axios.post(`${API}/create`, payload, {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error(res.data.message || "Create failed");
        return null;
      }

      toast.success("Created successfully");

      // Không fetch lại toàn bộ nếu không cần
      myGuidesFetchedRef.current = false;
      await fetchMyGuides();

      return res.data.guide;
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
      return null;
    } finally {
      endLoading();
    }
  };

  // ================================
  // UPDATE
  // ================================
  const updateGuide = async (id, payload) => {
    if (!id) return null;

    try {
      startLoading();
      const res = await axios.put(`${API}/update/${id}`, payload, {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error("Update failed");
        return null;
      }

      toast.success("Updated successfully");

      myGuidesFetchedRef.current = false;
      await fetchMyGuides();

      return res.data.guide;
    } catch {
      toast.error("Update failed");
      return null;
    } finally {
      endLoading();
    }
  };

  // ================================
  // DELETE
  // ================================
  const deleteGuide = async (id) => {
    if (!id) return false;

    try {
      startLoading();
      const res = await axios.delete(`${API}/delete/${id}`, {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error("Delete failed");
        return false;
      }

      toast.success("Deleted");

      dispatch(setMyGuides(myGuides.filter((g) => g._id !== id)));

      return true;
    } catch {
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
