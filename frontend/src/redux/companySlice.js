import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

// --- ASYNC THUNKS ---

// 1. Tạo công ty mới (Recruiter)
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

// 2. Cập nhật công ty (Recruiter)
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

// 3. Lấy danh sách công ty CỦA RECRUITER (Private)
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

// 4. Lấy danh sách TẤT CẢ công ty (Public - Cho trang Home)
export const fetchPublicCompanies = createAsyncThunk(
  "company/fetchPublicCompanies",
  async (_, { rejectWithValue }) => {
    try {
      // Route public mới tạo
      const res = await axios.get(`${COMPANY_API_END_POINT}/public`);
      return res.data.companies || [];
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to fetch public companies";
      console.error("❌ Error fetching public companies:", msg);
      return rejectWithValue(msg);
    }
  }
);

// 5. Lấy chi tiết công ty (Public View)
export const getCompanyById = createAsyncThunk(
  "company/getCompanyById",
  async (companyId, { rejectWithValue }) => {
    try {
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

// 6. Lấy chi tiết công ty để Edit (Admin/Recruiter View)
export const getCompanyByIdAdmin = createAsyncThunk(
  "company/getCompanyByIdAdmin",
  async (companyId, { rejectWithValue }) => {
    try {
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

// 7. Xóa công ty (Recruiter)
export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`, {
        withCredentials: true,
      });
      return companyId; // Trả về ID để xóa khỏi state
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to delete company";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// --- SLICE ---
const companySlice = createSlice({
  name: "company",
  initialState: {
    singleCompany: null,
    companies: [], // Dùng chung state này cho cả danh sách Public và Private (tùy ngữ cảnh sử dụng)
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
    // fetchCompanies (Private)
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

    // fetchPublicCompanies (Public) - Thêm xử lý loading cho cái này
    builder
      .addCase(fetchPublicCompanies.pending, (state) => {
        state.loading = true; // Có thể tạo state loading riêng nếu muốn tách biệt UI
        state.error = null;
      })
      .addCase(fetchPublicCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload; // Ghi đè vào companies chung
      })
      .addCase(fetchPublicCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // createCompany
    builder.addCase(createCompany.fulfilled, (state, action) => {
      state.companies.push(action.payload);
    });

    // updateCompany
    builder.addCase(updateCompany.fulfilled, (state, action) => {
      // Cập nhật trong danh sách
      const index = state.companies.findIndex(
        (c) => c._id === action.payload._id
      );
      if (index !== -1) {
        state.companies[index] = action.payload;
      }
      // Nếu đang xem chi tiết công ty này thì cập nhật luôn singleCompany
      if (state.singleCompany?._id === action.payload._id) {
        state.singleCompany = action.payload;
      }
    });

    // getCompanyById (Public View)
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

    // getCompanyByIdAdmin (Private View)
    builder
      .addCase(getCompanyByIdAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanyByIdAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.singleCompany = action.payload;
      })
      .addCase(getCompanyByIdAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // deleteCompany
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
