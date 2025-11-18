import { createSlice } from "@reduxjs/toolkit";
// [Giữ nguyên các imports và Thunks (createAsyncThunk) của bạn]

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
    // ----------------------------------------------------
    // 🔥 NEW CORE REDUCER: Cập nhật state bằng Path (Ví dụ: 'personalInfo.fullName')
    // ----------------------------------------------------
    updateLocalCVState: (state, action) => {
      const { path, value } = action.payload;

      // Logic này dựa vào thư viện Immer của Redux Toolkit để update nested state an toàn
      const keys = path.split(".");
      let target = state;

      // Duyệt qua path, đảm bảo các object lồng nhau tồn tại
      for (let i = 0; i < keys.length - 1; i++) {
        // Nếu target không tồn tại (null/undefined), tạo object rỗng
        if (!target[keys[i]]) target[keys[i]] = {};
        target = target[keys[i]];
      }
      // Set giá trị cuối cùng
      target[keys[keys.length - 1]] = value;
    },
    // ----------------------------------------------------

    // list
    setCVs: (state, action) => {
      state.cvs = action.payload;
    },

    // ====== set whole CV (Dùng để load data) ======
    setFullCV: (state, action) => {
      const cv = action.payload;
      if (!cv) return;

      // Đây là logic merge dữ liệu rất tốt của bạn
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

      // Cần đảm bảo các trường khác được merge đúng cách (dùng toán tử ?? của bạn là ổn)
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

    // ====== Update individual parts (Giữ lại vì chúng là action update array/object) ======
    updateMeta: (state, action) => {
      state.meta = { ...state.meta, ...action.payload };
    },

    updatePersonalInfo: (state, action) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },

    updateEducation: (state, action) => {
      state.education = action.payload; // Thay thế full array
    },
    updateWorkExperience: (state, action) => {
      state.workExperience = action.payload; // Thay thế full array
    },
    updateSkills: (state, action) => {
      state.skills = action.payload; // Thay thế full array
    },
    updateCertifications: (state, action) => {
      state.certifications = action.payload; // Thay thế full array
    },
    updateLanguages: (state, action) => {
      state.languages = action.payload; // Thay thế full array
    },
    updateAchievements: (state, action) => {
      state.achievements = action.payload; // Thay thế full array
    },
    updateProjects: (state, action) => {
      state.projects = action.payload; // Thay thế full array
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
      // Dùng Object.assign để reset state về initialState an toàn
      Object.assign(state, initialState);
    },
  },
  // [extraReducers giữ nguyên]
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
  updateLocalCVState, // ✅ EXPORT ACTION MỚI
  setLoading,
  setSaving,
  setError,
  setPublicUrl,
  setAutoSaveStatus,
  clearCVState,
} = cvSlice.actions;

export default cvSlice.reducer;
