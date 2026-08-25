import type { CartState } from "../../app/screens/cartPage/cartSlice";
import type { Product } from "./product";

/** REACT APP STATE **/
export interface AppRootStore {
  cart: CartState;
  homePage: HomePageState;
  productsPage: ProductsPageState;
}

/**
 * HOMEPAGE — mirrors Burak's popularDishes/newDishes split, renamed to match
 * K-Glow's actual sections. No topUsers/activeUsers here: K-Glow replaced
 * that section with customer Reviews instead, so there's nothing to mirror.
 */
export interface HomePageState {
  bestsellers: Product[];
  newArrivals: Product[];
}

/**
 * PRODUCTS PAGE — `products` backs the Shop grid, `chosenProduct` the detail
 * page. No `restaurant` field: Burak renders the restaurant owner's Member
 * card on its products page, K-Glow's Shop page has no such block.
 */
export interface ProductsPageState {
  products: Product[];
  chosenProduct: Product | null;
}
