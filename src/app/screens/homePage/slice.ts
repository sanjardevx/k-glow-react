import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { HomePageState } from "../../../lib/types/screen";
import type { Product } from "../../../lib/types/product";

const initialState: HomePageState = {
  bestsellers: [],
  newArrivals: [],
};

const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    setBestsellers: (state, action: PayloadAction<Product[]>) => {
      state.bestsellers = action.payload;
    },
    setNewArrivals: (state, action: PayloadAction<Product[]>) => {
      state.newArrivals = action.payload;
    },
  },
});

export const { setBestsellers, setNewArrivals } = homePageSlice.actions;

const HomePageReducer = homePageSlice.reducer;
export default HomePageReducer;
