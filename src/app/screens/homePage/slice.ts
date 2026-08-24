import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { HomePageState } from "../../../lib/types/screen";
import type { Product } from "../../../lib/types/product";

const initialState: HomePageState = {
  bestsellers: [],
  discounted: [],
};

const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    setBestsellers: (state, action: PayloadAction<Product[]>) => {
      state.bestsellers = action.payload;
    },
    setDiscounted: (state, action: PayloadAction<Product[]>) => {
      state.discounted = action.payload;
    },
  },
});

export const { setBestsellers, setDiscounted } = homePageSlice.actions;

const HomePageReducer = homePageSlice.reducer;
export default HomePageReducer;
