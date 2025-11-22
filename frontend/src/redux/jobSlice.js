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
    savedJobs: [],
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
    setSavedJobs(state, action) {
      state.savedJobs = action.payload;
    },
    addSavedJob(state, action) {
      const job = action.payload;
      const exists = state.savedJobs.some((j) => j._id === job._id);
      if (!exists) {
        state.savedJobs.push(job);
      }
    },
    removeSavedJob(state, action) {
      const jobId = action.payload;
      state.savedJobs = state.savedJobs.filter((j) => j._id !== jobId);
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
