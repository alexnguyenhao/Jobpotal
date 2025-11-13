import { createSlice } from "@reduxjs/toolkit";

const cvSlice = createSlice({
  name: "cv",
  initialState: {
    cvs: [],
    singleCV: null,
    loading: false,
    saving: false,
    error: null,
    publicUrl: "",
    autoSaveStatus: "",
  },

  reducers: {
    setCVs: (state, action) => {
      state.cvs = action.payload;
    },

    setSingleCV: (state, action) => {
      state.singleCV = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setSaving: (state, action) => {
      state.saving = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setPublicUrl: (state, action) => {
      state.publicUrl = action.payload;
    },

    setAutoSaveStatus: (state, action) => {
      state.autoSaveStatus = action.payload;
    },
  },
});

export const {
  setCVs,
  setSingleCV,
  setLoading,
  setSaving,
  setError,
  setPublicUrl,
  setAutoSaveStatus,
} = cvSlice.actions;

export default cvSlice.reducer;
