import { useEffect } from "react";
import { Hero } from "./Hero";
import { Statistics } from "./Statistics";
import { Bestsellers } from "./Bestsellers";
import { Discounted } from "./Discounted";
import { Reviews } from "./Reviews";
import { Brands } from "./Brands";
import { Events } from "./Events";
import "../../../css/home.css";

export function HomePage() {
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
