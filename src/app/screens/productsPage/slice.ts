import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProductsPageState } from "../../../lib/types/screen";
import type { Product } from "../../../lib/types/product";

const initialState: ProductsPageState = {
  products: [],
  chosenProduct: null,
};

const productsPageSlice = createSlice({
  name: "productsPage",
  initialState,
  reducers: {
    // See the note in homePage/slice.ts — the payload type describes the call
    // site, so the array still has to be verified at runtime.
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = Array.isArray(action.payload) ? action.payload : [];
    },
    setChosenProduct: (state, action: PayloadAction<Product | null>) => {
      state.chosenProduct = action.payload;
    },
  },
});

export const { setProducts, setChosenProduct } = productsPageSlice.actions;

const ProductsPageReducer = productsPageSlice.reducer;
export default ProductsPageReducer;
