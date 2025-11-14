// src/redux/cvSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cvs: [],

  // Tách nhỏ single CV thành nhiều phần
  meta: {
    _id: null,
    title: "",
    template: "",
    isPublic: false,
    shareUrl: "",
    createdAt: null,
    updatedAt: null,
    user: null,
  },

  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: null,
    gender: "",
    profilePhoto: "",
    position: "",
    summary: "",
  },

  education: [],
  workExperience: [],
  skills: [],
  certifications: [],
  languages: [],
  achievements: [],
  projects: [],

  styleConfig: {
    fontFamily: "font-sans",
    fontSizeClass: "text-base",
    primaryColor: "#4D6CFF",
    backgroundColor: "#ffffff",
    textColor: "#111",
    spacing: "normal",
    borderRadius: 12,
    shadowLevel: 1,
  },

  // flags
  loading: false,
  saving: false,
  error: null,
  publicUrl: "",
  autoSaveStatus: "",
};

const cvSlice = createSlice({
  name: "cv",
  initialState,
  reducers: {
    // list
    setCVs: (state, action) => {
      state.cvs = action.payload;
    },

    // ====== set whole CV (use sparingly, not for autosave) ======
    setFullCV: (state, action) => {
      const cv = action.payload;
      if (!cv) return;

      // meta
      state.meta = {
        _id: cv._id ?? cv.id ?? state.meta._id,
        title: cv.title ?? state.meta.title,
        template: cv.template ?? state.meta.template,
        isPublic: !!cv.isPublic,
        shareUrl: cv.shareUrl ?? "",
        createdAt: cv.createdAt ?? state.meta.createdAt,
        updatedAt: cv.updatedAt ?? state.meta.updatedAt,
        user: cv.user ?? state.meta.user,
      };

      state.personalInfo = cv.personalInfo ?? state.personalInfo;
      state.education = cv.education ?? state.education;
      state.workExperience = cv.workExperience ?? state.workExperience;
      state.skills = cv.skills ?? state.skills;
      state.certifications = cv.certifications ?? state.certifications;
      state.languages = cv.languages ?? state.languages;
      state.achievements = cv.achievements ?? state.achievements;
      state.projects = cv.projects ?? state.projects;
      state.styleConfig = cv.styleConfig ?? state.styleConfig;
    },

    // ====== Update individual parts (use these in autosave) ======
    updateMeta: (state, action) => {
      state.meta = { ...state.meta, ...action.payload };
    },

    updatePersonalInfo: (state, action) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },

    updateEducation: (state, action) => {
      // replace full education array
      state.education = action.payload;
    },

    updateWorkExperience: (state, action) => {
      state.workExperience = action.payload;
    },

    updateSkills: (state, action) => {
      state.skills = action.payload;
    },

    updateCertifications: (state, action) => {
      state.certifications = action.payload;
    },

    updateLanguages: (state, action) => {
      state.languages = action.payload;
    },

    updateAchievements: (state, action) => {
      state.achievements = action.payload;
    },

    updateProjects: (state, action) => {
      state.projects = action.payload;
    },

    updateStyleConfig: (state, action) => {
      state.styleConfig = { ...state.styleConfig, ...action.payload };
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
    clearCVState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setCVs,
  setFullCV,
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
  setSaving,
  setError,
  setPublicUrl,
  setAutoSaveStatus,
  clearCVState,
} = cvSlice.actions;

export default cvSlice.reducer;
