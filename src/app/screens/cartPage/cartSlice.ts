import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "../../../lib/types/cart";
import type { Product } from "../../../lib/types/product";
import { finalPrice } from "../productsPage/productsData";

export const CART_STORAGE_KEY = "kglow-cart";

export interface CartState {
  items: CartItem[];
}

/** Snapshot a catalog product into the line the basket will render. */
export function toCartItem(product: Product, quantity = 1): CartItem {
  return {
    _id: product._id,
    quantity,
    productName: product.productName,
    productBrand: product.productBrand,
    productImage: product.productImages[0] ?? "",
    price: finalPrice(product),
  };
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Stored JSON is no more trustworthy than an API response — anything that
    // isn't an array would break every `.map()` downstream.
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupt JSON, or storage blocked entirely (private mode).
    return [];
  }
}

const initialState: CartState = { items: loadCart() };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const incoming = action.payload;
      const existing = state.items.find((i) => i._id === incoming._id);
      if (existing) {
        existing.quantity += incoming.quantity;
      } else {
        state.items.push(incoming);
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },
    setQuantity(
      state,
      action: PayloadAction<{ _id: string; quantity: number }>,
    ) {
      const { _id, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i._id !== _id);
        return;
      }
      const item = state.items.find((i) => i._id === _id);
      if (item) item.quantity = quantity;
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, setQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
