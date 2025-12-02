import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    singleCategory: null,
    categories: [],
  },
  reducers: {
    // Set toàn bộ danh sách
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    // Set 1 category (dùng cho trang chi tiết/edit)
    setSingleCategory: (state, action) => {
      state.singleCategory = action.payload;
    },
    // Thêm mới vào danh sách hiện tại
    addCategory: (state, action) => {
      state.categories.unshift(action.payload); // Thêm vào đầu danh sách
    },
    // Cập nhật 1 item trong danh sách
    updateCategoryInState: (state, action) => {
      const index = state.categories.findIndex(
        (cat) => cat._id === action.payload._id
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    // Xóa item khỏi danh sách
    removeCategory: (state, action) => {
      state.categories = state.categories.filter(
        (cat) => cat._id !== action.payload
      );
    },
  },
});

export const {
  setCategories,
  setSingleCategory,
  addCategory,
  updateCategoryInState,
  removeCategory,
} = categorySlice.actions;

export default categorySlice.reducer;
