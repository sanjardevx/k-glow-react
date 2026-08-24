import type { CartState } from "../../app/screens/cartPage/cartSlice";
import type { Product } from "./product";

/** REACT APP STATE **/
export interface AppRootStore {
  cart: CartState;
  homePage: HomePageState;
}

/**
 * HOMEPAGE — mirrors Burak's popularDishes/newDishes split, renamed to match
 * K-Glow's actual sections. No topUsers/activeUsers here: K-Glow replaced
 * that section with customer Reviews instead, so there's nothing to mirror.
 */
export interface HomePageState {
  bestsellers: Product[];
  discounted: Product[];
}
