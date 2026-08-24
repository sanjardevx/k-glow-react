import { createSelector } from "@reduxjs/toolkit";
import type { AppRootStore } from "../../../lib/types/screen";

const selectHomePage = (state: AppRootStore) => state.homePage;

export const retrieveBestsellers = createSelector(
  selectHomePage,
  (homePage) => homePage.bestsellers,
);

export const retrieveDiscounted = createSelector(
  selectHomePage,
  (homePage) => homePage.discounted,
);
