import { createSelector } from "@reduxjs/toolkit";
import type { AppRootStore } from "../../../lib/types/screen";

const selectOrdersPage = (state: AppRootStore) => state.ordersPage;

export const retrieveWaitingOrders = createSelector(
  selectOrdersPage,
  (ordersPage) => ordersPage.waitingOrders,
);

export const retrieveConfirmedOrders = createSelector(
  selectOrdersPage,
  (ordersPage) => ordersPage.confirmedOrders,
);

export const retrieveRejectedOrders = createSelector(
  selectOrdersPage,
  (ordersPage) => ordersPage.rejectedOrders,
);
