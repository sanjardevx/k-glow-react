import { useAppSelector } from "../../hooks";
import type { CartItem } from "../../../lib/types/cart";

/**
 * No resolution step: each line already carries its own name, price and image,
 * so the basket renders straight from state whatever page the shopper is on.
 */
export function useCartItems(): CartItem[] {
  return useAppSelector((state) => state.cart.items);
}

export function useCartCount(): number {
  const items = useCartItems();
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function useCartSubtotal(): number {
  const items = useCartItems();
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

/** Free at/above this subtotal; below it, delivery is paid to the courier
 * on pickup — never added to the checkout total. */
export const FREE_DELIVERY_THRESHOLD = 500000;

export function isFreeDelivery(subtotal: number): boolean {
  return subtotal >= FREE_DELIVERY_THRESHOLD;
}
