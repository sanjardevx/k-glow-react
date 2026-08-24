import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartLine {
  productId: number;
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
    addItem(state, action: PayloadAction<{ productId: number; quantity?: number }>) {
      const { productId, quantity = 1 } = action.payload;
      const existing = state.lines.find((l) => l.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.lines.push({ productId, quantity });
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.lines = state.lines.filter((l) => l.productId !== action.payload);
    },
    setQuantity(
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
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
