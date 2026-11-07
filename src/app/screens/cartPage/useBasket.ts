import { useAppDispatch } from "../../hooks";
import { useCartCount, useCartItems, useCartSubtotal } from "./cartSelectors";
import {
  addItem,
  clearCart,
  removeItem,
  setQuantity,
  toCartItem,
} from "./cartSlice";
import { useGlobals } from "../../context/useGlobals";
import { t } from "../../../lib/i18n";
import { showError } from "../../../lib/toast";
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
  const { authMember } = useGlobals();

  return {
    items: useCartItems(),
    count: useCartCount(),
    subtotal: useCartSubtotal(),

    /**
     * Browsing is open to everyone; filling a bag is not. Guarding here rather
     * than on each button means every entry point — the two home rows, Shop,
     * the product page and its related row — is covered by this one check.
     *
     * Returns whether the item actually went in, so a caller can hold back its
     * "Added ✓" confirmation when it didn't.
     */
    onAdd: (product: Product, quantity = 1): boolean => {
      if (!authMember) {
        showError(t("error.loginFirst"));
        return false;
      }
      dispatch(addItem(toCartItem(product, quantity)));
      return true;
    },

    onIncrease: (item: CartItem) =>
      dispatch(setQuantity({ _id: item._id, quantity: item.quantity + 1 })),

    /** Drops the line when the last unit is removed — see the slice. */
    onDecrease: (item: CartItem) =>
      dispatch(setQuantity({ _id: item._id, quantity: item.quantity - 1 })),

    onDelete: (item: CartItem) => dispatch(removeItem(item._id)),

    onDeleteAll: () => dispatch(clearCart()),
  };
}
