import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrdersPageState } from "../../../lib/types/screen";
import type { Order } from "../../../lib/types/order";

const initialState: OrdersPageState = {
  waitingOrders: [],
  confirmedOrders: [],
  rejectedOrders: [],
};

/** Same reasoning as the other slices: the payload type describes the call
 *  site, so the array still has to be verified at runtime. */
const ordersPageSlice = createSlice({
  name: "ordersPage",
  initialState,
  reducers: {
    setWaitingOrders: (state, action: PayloadAction<Order[]>) => {
      state.waitingOrders = Array.isArray(action.payload) ? action.payload : [];
    },
    setConfirmedOrders: (state, action: PayloadAction<Order[]>) => {
      state.confirmedOrders = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
    setRejectedOrders: (state, action: PayloadAction<Order[]>) => {
      state.rejectedOrders = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
  },
});

export const { setWaitingOrders, setConfirmedOrders, setRejectedOrders } =
  ordersPageSlice.actions;

const OrdersPageReducer = ordersPageSlice.reducer;
export default OrdersPageReducer;
