import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

// ============================================================
// 🔹 Async Thunks
// ============================================================

// 🟢 Create company
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

// 🟡 Update company
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

// 🔵 Get all companies (for recruiter)
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

// 🟣 Get single company by ID (public)
export const getCompanyById = createAsyncThunk(
  "company/getCompanyById",
  async (companyId, { rejectWithValue }) => {
    try {
      // ⚠️ Nếu bạn muốn public: bỏ withCredentials
      const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`);
      return res.data?.company || null;
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to fetch company details";
      console.error("❌ Error fetching company:", msg);
      return rejectWithValue(msg);
    }
  }
);

// 🔴 Delete company
export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${COMPANY_API_END_POINT}/delete/${companyId}`,
        { withCredentials: true }
      );
      toast.success("✅ Company deleted successfully!");
      return companyId;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to delete company";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// ============================================================
// 🔹 Slice
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
  },
  extraReducers: (builder) => {
    // =================== GET ALL ===================
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

    // =================== GET ONE ===================
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

    // =================== DELETE ===================
    builder.addCase(deleteCompany.fulfilled, (state, action) => {
      state.companies = state.companies.filter((c) => c._id !== action.payload);
    });
  },
});

export const { setSingleCompany, setCompanies, setSearchCompanyByText } =
  companySlice.actions;
export default companySlice.reducer;
