import { configureStore } from "@reduxjs/toolkit";
import type { ThunkAction, Action } from "@reduxjs/toolkit";
import cartReducer, { CART_STORAGE_KEY } from "./screens/cartPage/cartSlice";
import homePageReducer from "./screens/homePage/slice";
import productsPageReducer from "./screens/productsPage/slice";
import ordersPageReducer from "./screens/ordersPage/slice";

// Dev only: in production it printed every action and the whole state —
// basket, orders, the signed-in member — to any visitor's console. Imported
// only in development, so production doesn't download it at all.
const devMiddleware = import.meta.env.DEV
  ? [(await import("redux-logger")).logger]
  : [];

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    homePage: homePageReducer,
    productsPage: productsPageReducer,
    ordersPage: ordersPageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(devMiddleware),
});

/**
 * The bag outlives the tab. Persisting from a subscription rather than inside
 * the reducers keeps those pure — they stay plain state transitions, with the
 * one side effect in a single place.
 */
let lastPersisted = store.getState().cart.items;
store.subscribe(() => {
  const { items } = store.getState().cart;
  if (items === lastPersisted) return;
  lastPersisted = items;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or blocked — the bag still works, it just won't come back
    // after a reload.
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
