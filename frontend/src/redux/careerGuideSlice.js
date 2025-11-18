import { createSlice } from "@reduxjs/toolkit";

const careerGuideSlice = createSlice({
  name: "careerGuide",
  initialState: {
    publicGuides: [], // Student xem
    myGuides: [], // Recruiter xem
    singleGuide: null, // Chi tiết bài viết
    loading: false,
    error: null,
  },
  reducers: {
    setPublicGuides: (state, action) => {
      state.publicGuides = action.payload;
    },
    setMyGuides: (state, action) => {
      state.myGuides = action.payload;
    },
    setSingleGuide: (state, action) => {
      state.singleGuide = action.payload;
    },
    resetSingleGuide: (state) => {
      state.singleGuide = null;
    },

    setCareerGuideLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCareerGuideError: (state, action) => {
      state.error = action.payload;
    },
    clearCareerGuideError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setPublicGuides,
  setMyGuides,
  setSingleGuide,
  resetSingleGuide,
  setCareerGuideLoading,
  setCareerGuideError,
  clearCareerGuideError,
} = careerGuideSlice.actions;

export default careerGuideSlice.reducer;
