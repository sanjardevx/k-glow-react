import { useAppDispatch } from "../../hooks";
import { useCartCount, useCartItems, useCartSubtotal } from "./cartSelectors";
import {
  addItem,
  clearCart,
  removeItem,
  setQuantity,
  toCartItem,
} from "./cartSlice";
import type { Product } from "../../../lib/types/product";
import type { CartItem } from "../../../lib/types/cart";

/**
 * One entry point for everything the bag can do. Components ask for the
 * operation they want ("add this product") instead of knowing which action to
 * dispatch and that a catalog product has to be snapshotted into a cart line
 * first — that plumbing lives here, in one place.
 */
export function useBasket() {
  const dispatch = useAppDispatch();

  return {
    items: useCartItems(),
    count: useCartCount(),
    subtotal: useCartSubtotal(),

    onAdd: (product: Product, quantity = 1) =>
      dispatch(addItem(toCartItem(product, quantity))),

    onIncrease: (item: CartItem) =>
      dispatch(setQuantity({ _id: item._id, quantity: item.quantity + 1 })),

    /** Drops the line when the last unit is removed — see the slice. */
    onDecrease: (item: CartItem) =>
      dispatch(setQuantity({ _id: item._id, quantity: item.quantity - 1 })),

    onDelete: (item: CartItem) => dispatch(removeItem(item._id)),

    onDeleteAll: () => dispatch(clearCart()),
  };
}
