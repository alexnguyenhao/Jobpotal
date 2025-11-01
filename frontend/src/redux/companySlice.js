import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

// ============================================================
// 🟢 CREATE company
// ============================================================
export const createCompany = createAsyncThunk(
  "company/createCompany",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        formData,
        { withCredentials: true }
      );
      toast.success("✅ Company created successfully!");
      return res.data.company;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to create company";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// ============================================================
// 🟡 UPDATE company
// ============================================================
export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${id}`,
        data,
        { withCredentials: true }
      );
      toast.success("✅ Company updated successfully!");
      return res.data.company;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update company";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// ============================================================
// 🔵 GET all companies (recruiter’s list)
// ============================================================
export const fetchCompanies = createAsyncThunk(
  "company/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
        withCredentials: true,
      });
      return res.data?.companies || [];
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to fetch companies list";
      console.error("❌ Error fetching companies:", msg);
      return rejectWithValue(msg);
    }
  }
);

// ============================================================
// 🟣 GET one company (public)
// ============================================================
export const getCompanyById = createAsyncThunk(
  "company/getCompanyById",
  async (companyId, { rejectWithValue }) => {
    try {
      // ✅ public route (không cần auth)
      const res = await axios.get(`${COMPANY_API_END_POINT}/${companyId}`);
      return res.data?.company || null;
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to fetch company details";
      console.error("❌ Error fetching company:", msg);
      return rejectWithValue(msg);
    }
  }
);

// ============================================================
// 🟣 GET one company (for recruiter — private details)
// ============================================================
export const getCompanyByIdAdmin = createAsyncThunk(
  "company/getCompanyByIdAdmin",
  async (companyId, { rejectWithValue }) => {
    try {
      // ✅ recruiter route (có auth)
      const res = await axios.get(
        `${COMPANY_API_END_POINT}/admin/${companyId}`,
        { withCredentials: true }
      );
      return res.data?.company || null;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Failed to fetch admin company details";
      console.error("❌ Error fetching admin company:", msg);
      return rejectWithValue(msg);
    }
  }
);

// ============================================================
// 🔴 DELETE company
// ============================================================
export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`, {
        withCredentials: true,
      });
      return companyId;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to delete company";
      return rejectWithValue(msg);
    }
  }
);

// ============================================================
// 🧩 Slice setup
// ============================================================
const companySlice = createSlice({
  name: "company",
  initialState: {
    singleCompany: null,
    companies: [],
    searchCompanyByText: "",
    loading: false,
    error: null,
  },
  reducers: {
    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload;
    },
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
    setSearchCompanyByText: (state, action) => {
      state.searchCompanyByText = action.payload;
    },
    resetCompanyState: (state) => {
      state.singleCompany = null;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // =================== FETCH ALL ===================
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // =================== CREATE ===================
    builder.addCase(createCompany.fulfilled, (state, action) => {
      state.companies.push(action.payload);
    });

    // =================== UPDATE ===================
    builder.addCase(updateCompany.fulfilled, (state, action) => {
      const index = state.companies.findIndex(
        (c) => c._id === action.payload._id
      );
      if (index !== -1) state.companies[index] = action.payload;
    });

    // =================== GET ONE (public) ===================
    builder
      .addCase(getCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleCompany = action.payload;
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // =================== GET ONE (admin) ===================
    builder.addCase(getCompanyByIdAdmin.fulfilled, (state, action) => {
      state.singleCompany = action.payload;
    });

    // =================== DELETE ===================
    builder.addCase(deleteCompany.fulfilled, (state, action) => {
      state.companies = state.companies.filter((c) => c._id !== action.payload);
    });
  },
});

export const {
  setSingleCompany,
  setCompanies,
  setSearchCompanyByText,
  resetCompanyState,
} = companySlice.actions;

export default companySlice.reducer;
