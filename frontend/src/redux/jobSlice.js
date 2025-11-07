import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    loading: false,
    searchJobByText: "",
    allAppliedJobs: [],
    savedJobs: [], // 💾 Thêm mới
  },
  reducers: {
    setAllJobs(state, action) {
      state.allJobs = action.payload;
    },
    setSingleJob(state, action) {
      state.singleJob = action.payload;
    },
    setAllAdminJobs(state, action) {
      state.allAdminJobs = action.payload;
    },
    setSearchJobsByText(state, action) {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs(state, action) {
      state.allAppliedJobs = action.payload;
    },

    // 💾 Saved Jobs
    setSavedJobs(state, action) {
      state.savedJobs = action.payload;
    },
    addSavedJob(state, action) {
      // tránh thêm trùng job
      const jobId = action.payload;
      if (!state.savedJobs.some((j) => j._id === jobId || j === jobId)) {
        state.savedJobs.push(jobId);
      }
    },
    removeSavedJob(state, action) {
      const jobId = action.payload;
      state.savedJobs = state.savedJobs.filter(
        (j) => (j._id || j).toString() !== jobId.toString()
      );
    },
  },
});

export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobsByText,
  setAllAppliedJobs,
  setSavedJobs,
  addSavedJob,
  removeSavedJob,
} = jobSlice.actions;

export default jobSlice.reducer;
