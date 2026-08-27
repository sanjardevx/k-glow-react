import { useEffect } from "react";
import { Hero } from "./Hero";
import { Statistics } from "./Statistics";
import { Bestsellers } from "./Bestsellers";
import { NewArrivals } from "./NewArrivals";
import { Reviews } from "./Reviews";
import { Brands } from "./Brands";
import { Events } from "./Events";
import { useAppDispatch } from "../../hooks";
import { setBestsellers, setNewArrivals } from "./slice";
import type { AppDispatch } from "../../store";
import type { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import type { AuthMode } from "../../components/auth";
import "../../../css/home.css";

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: AppDispatch) => ({
  setBestsellers: (data: Product[]) => dispatch(setBestsellers(data)),
  setNewArrivals: (data: Product[]) => dispatch(setNewArrivals(data)),
});

interface HomePageProps {
  onAuthOpen: (mode: AuthMode) => void;
}

export function HomePage({ onAuthOpen }: HomePageProps) {
  // Selector: Store => Data
  const { setBestsellers, setNewArrivals } = actionDispatch(useAppDispatch());

  // Slice: Data => Store
  useEffect(() => {
    const productService = new ProductService();

    productService
      .getProducts({ page: 1, limit: 4, order: "productViews" })
      .then((data) => setBestsellers(data))
      .catch((err) => console.log(err));

    productService
      .getProducts({ page: 1, limit: 4, order: "createdAt" })
      .then((data) => setNewArrivals(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="homepage">
      <Hero />
      <Statistics />
      <Bestsellers />
      <NewArrivals />
      <Reviews />
      <Brands />
      <Events onAuthOpen={onAuthOpen} />
    </div>
  );
}
