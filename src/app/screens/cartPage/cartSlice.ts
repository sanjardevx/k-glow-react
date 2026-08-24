import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * productId is `number` for the old local mock catalog (array index) and
 * `string` for real backend products (Mongo `_id`) — both live side by side
 * until every product-listing screen is migrated off the mock data. Cart
 * resolution for the `string` case lands in a later step.
 */
export interface CartLine {
  productId: number | string;
  quantity: number;
}

export interface CartState {
  lines: CartLine[];
}

const initialState: CartState = { lines: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(
      state,
      action: PayloadAction<{ productId: number | string; quantity?: number }>,
    ) {
      const { productId, quantity = 1 } = action.payload;
      const existing = state.lines.find((l) => l.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.lines.push({ productId, quantity });
      }
    },
    removeItem(state, action: PayloadAction<number | string>) {
      state.lines = state.lines.filter((l) => l.productId !== action.payload);
    },
    setQuantity(
      state,
      action: PayloadAction<{ productId: number | string; quantity: number }>,
    ) {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.lines = state.lines.filter((l) => l.productId !== productId);
        return;
      }
      const line = state.lines.find((l) => l.productId === productId);
      if (line) line.quantity = quantity;
    },
    clearCart(state) {
      state.lines = [];
    },
  },
});

export const { addItem, removeItem, setQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
