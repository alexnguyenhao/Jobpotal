import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    singleCategory: null,
    categories: [],
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSingleCategory: (state, action) => {
      state.singleCategory = action.payload;
    },
  },
});

export const { setCategories, setSingleCategory } = categorySlice.actions;
export default categorySlice.reducer;
