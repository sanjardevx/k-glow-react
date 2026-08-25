import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { HomePageState } from "../../../lib/types/screen";
import type { Product } from "../../../lib/types/product";

const initialState: HomePageState = {
  bestsellers: [],
  newArrivals: [],
};

/**
 * The payload type is a compile-time promise about the call site, not about
 * the server: these arrays come from `axios`, whose `result.data` is asserted
 * rather than checked. Anything that isn't an array would crash the `.map()`
 * in the section components, so it's rejected at the door instead.
 */
const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    setBestsellers: (state, action: PayloadAction<Product[]>) => {
      state.bestsellers = Array.isArray(action.payload) ? action.payload : [];
    },
    setNewArrivals: (state, action: PayloadAction<Product[]>) => {
      state.newArrivals = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const { setBestsellers, setNewArrivals } = homePageSlice.actions;

const HomePageReducer = homePageSlice.reducer;
export default HomePageReducer;
