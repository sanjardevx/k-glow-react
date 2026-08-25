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
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setChosenProduct: (state, action: PayloadAction<Product | null>) => {
      state.chosenProduct = action.payload;
    },
  },
});

export const { setProducts, setChosenProduct } = productsPageSlice.actions;

const ProductsPageReducer = productsPageSlice.reducer;
export default ProductsPageReducer;
