import { configureStore } from "@reduxjs/toolkit";
import type { ThunkAction, Action } from "@reduxjs/toolkit";
import { logger as reduxLogger } from "redux-logger";
import cartReducer from "./screens/cartPage/cartSlice";
import homePageReducer from "./screens/homePage/slice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    homePage: homePageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(reduxLogger),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
