import { createSelector } from "@reduxjs/toolkit";
import type { AppRootStore } from "../../../lib/types/screen";

const selectHomePage = (state: AppRootStore) => state.homePage;

export const retrieveBestsellers = createSelector(
  selectHomePage,
  (homePage) => homePage.bestsellers,
);

export const retrieveNewArrivals = createSelector(
  selectHomePage,
  (homePage) => homePage.newArrivals,
);

export const retrieveReviews = createSelector(
  selectHomePage,
  (homePage) => homePage.reviews,
);
