import { createSelector } from "@reduxjs/toolkit";
import type { AppRootStore } from "../../../lib/types/screen";

const selectProductsPage = (state: AppRootStore) => state.productsPage;

export const retrieveProducts = createSelector(
  selectProductsPage,
  (productsPage) => productsPage.products,
);

export const retrieveChosenProduct = createSelector(
  selectProductsPage,
  (productsPage) => productsPage.chosenProduct,
);
