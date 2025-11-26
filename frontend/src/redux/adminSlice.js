import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: {
      totalUsers: 0,
      totalJobs: 0,
      totalCompanies: 0,
      totalApplications: 0,
    },
    users: [],
    companies: [],
    jobs: [],
    applications: [],
    notifications: [],
    selectedUser: null,
    loading: false,
  },
  reducers: {
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
    setApplications: (state, action) => {
      state.applications = action.payload;
    },
    updateCompanyInStore: (state, action) => {
      const updatedCompany = action.payload;
      state.companies = state.companies.map((company) =>
        company._id === updatedCompany._id ? updatedCompany : company
      );
    },
    removeUserInStore: (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    },
    updateUserInStore: (state, action) => {
      const updatedUser = action.payload;
      state.users = state.users.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      );
    },
    updateJobInStore: (state, action) => {
      const updatedJob = action.payload;
      state.jobs = state.jobs.map((job) =>
        job._id === updatedJob._id ? updatedJob : job
      );
    },
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});

export const {
  setStats,
  setUsers,
  setCompanies,
  setApplications,
  updateCompanyInStore,
  removeUserInStore,
  updateUserInStore,
  updateJobInStore,
  setJobs,
  setNotifications,
  setSelectedUser,
} = adminSlice.actions;

export default adminSlice.reducer;
