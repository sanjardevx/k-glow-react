import { createSelector } from "@reduxjs/toolkit";
import type { AppRootStore } from "../../../lib/types/screen";

const selectHomePage = (state: AppRootStore) => state.homePage;

export const selectBestsellers = createSelector(
  selectHomePage,
  (homePage) => homePage.bestsellers,
);

export const selectDiscounted = createSelector(
  selectHomePage,
  (homePage) => homePage.discounted,
);
