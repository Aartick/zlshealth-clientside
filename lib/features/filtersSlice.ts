import { createSlice } from "@reduxjs/toolkit";
import { getAllFilters } from "../thunks/filtersThunks";
import { filters } from "@/interfaces/filters";

interface filtersState {
  categories: filters[];
  benefits: filters[];
  productTypes: filters[];
  loading: boolean;
}

const initialState: filtersState = {
  categories: [],
  benefits: [],
  productTypes: [],
  loading: false,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllFilters.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.benefits = action.payload.benefits;
        state.productTypes = action.payload.productTypes;
      })
      .addCase(getAllFilters.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default filtersSlice.reducer;
