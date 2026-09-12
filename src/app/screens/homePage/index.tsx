import { useEffect } from "react";
import { Hero } from "./Hero";
import { Statistics } from "./Statistics";
import { Bestsellers } from "./Bestsellers";
import { NewArrivals } from "./NewArrivals";
import { Reviews } from "./Reviews";
import { Brands } from "./Brands";
import { Events } from "./Events";
import { useAppDispatch } from "../../hooks";
import { setBestsellers, setNewArrivals, setReviews } from "./slice";
import type { AppDispatch } from "../../store";
import type { Product } from "../../../lib/types/product";
import type { Review } from "../../../lib/types/review";
import ProductService from "../../services/ProductService";
import ReviewService from "../../services/ReviewService";
import type { AuthMode } from "../../components/auth";
import "../../../css/home.css";

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: AppDispatch) => ({
  setBestsellers: (data: Product[]) => dispatch(setBestsellers(data)),
  setNewArrivals: (data: Product[]) => dispatch(setNewArrivals(data)),
  setReviews: (data: Review[]) => dispatch(setReviews(data)),
});

interface HomePageProps {
  onAuthOpen: (mode: AuthMode) => void;
}

export function HomePage({ onAuthOpen }: HomePageProps) {
  // Selector: Store => Data
  const { setBestsellers, setNewArrivals, setReviews } = actionDispatch(
    useAppDispatch(),
  );

  // Slice: Data => Store
  useEffect(() => {
    const productService = new ProductService();
    const reviewService = new ReviewService();

    productService
      .getProducts({ page: 1, limit: 6, order: "productViews" })
      .then((data) => setBestsellers(data))
      .catch((err) => console.log(err));

    productService
      .getProducts({ page: 1, limit: 6, order: "createdAt" })
      .then((data) => setNewArrivals(data))
      .catch((err) => console.log(err));

    reviewService
      .getReviews(4)
      .then((data) => setReviews(data))
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
