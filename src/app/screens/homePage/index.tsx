import { useEffect } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { Hero } from "./Hero";
import { Statistics } from "./Statistics";
import { Bestsellers } from "./Bestsellers";
import { Discounted } from "./Discounted";
import { Reviews } from "./Reviews";
import { Brands } from "./Brands";
import { Events } from "./Events";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setBestsellers } from "./slice";
import { retrieveBestsellers } from "./selector";
import type { AppDispatch } from "../../store";
import type { Product } from "../../../lib/types/product";
import "../../../css/home.css";

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: AppDispatch) => ({
  setBestsellers: (data: Product[]) => dispatch(setBestsellers(data)),
});
const bestsellersRetriever = createSelector(
  retrieveBestsellers,
  (bestsellers) => ({ bestsellers }),
);

export function HomePage() {
  const { setBestsellers: _setBestsellers } = actionDispatch(useAppDispatch());
  const { bestsellers: _bestsellers } = useAppSelector(bestsellersRetriever);
  // Selector: Store => Data

  useEffect(() => {
    // Backend Server data request => Data
    // Slice: Data => Store
  }, []);

  return (
    <div className="homepage">
      <Hero />
      <Statistics />
      <Bestsellers />
      <Discounted />
      <Reviews />
      <Brands />
      <Events />
    </div>
  );
}
