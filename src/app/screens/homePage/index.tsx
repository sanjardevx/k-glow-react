import { useEffect } from "react";
import { Hero } from "./Hero";
import { Statistics } from "./Statistics";
import { Bestsellers } from "./Bestsellers";
import { Discounted } from "./Discounted";
import { Reviews } from "./Reviews";
import { Brands } from "./Brands";
import { Events } from "./Events";
import { useAppDispatch } from "../../hooks";
import { setBestsellers } from "./slice";
import type { AppDispatch } from "../../store";
import type { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import "../../../css/home.css";

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: AppDispatch) => ({
  setBestsellers: (data: Product[]) => dispatch(setBestsellers(data)),
});

export function HomePage() {
  // Selector: Store => Data
  const { setBestsellers } = actionDispatch(useAppDispatch());

  // Slice: Data => Store
  useEffect(() => {
    const productService = new ProductService();
    productService
      .getProducts({ page: 1, limit: 4, order: "productViews" })
      .then((data) => setBestsellers(data))
      .catch((err) => console.log(err));
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
