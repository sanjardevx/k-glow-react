import type { CartState } from "../../app/screens/cartPage/cartSlice";
import type { Product } from "./product";
import type { Order } from "./order";
import type { Review } from "./review";

/** REACT APP STATE **/
export interface AppRootStore {
  cart: CartState;
  homePage: HomePageState;
  productsPage: ProductsPageState;
  ordersPage: OrdersPageState;
}

/**
 * HOMEPAGE — mirrors Burak's popularDishes/newDishes split, renamed to match
 * K-Glow's actual sections. No topUsers/activeUsers here: K-Glow replaced
 * that section with customer Reviews instead, so there's nothing to mirror.
 */
export interface HomePageState {
  bestsellers: Product[];
  newArrivals: Product[];
  reviews: Review[];
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

/**
 * ORDERS PAGE — one list per tab, named after K-Glow's own order statuses
 * (Burak's paused/process/finished became waiting/confirmed/rejected when the
 * checkout moved to bank transfer plus manual confirmation).
 */
export interface OrdersPageState {
  waitingOrders: Order[];
  confirmedOrders: Order[];
  rejectedOrders: Order[];
}
