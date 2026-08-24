import type { CartState } from "../../app/screens/cartPage/cartSlice";

/** REACT APP STATE **/
export interface AppRootStore {
  cart: CartState;
}

/**
 * Note: unlike Burak (which fetches homepage data via Redux thunks), K-Glow's
 * homepage sections read straight from the static `products` catalog — so
 * there's no HomePageState slice to type here yet. This will grow alongside
 * whichever screen next gets its own real Redux state.
 */
