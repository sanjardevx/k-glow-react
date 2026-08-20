import { useAppSelector } from "../../hooks";
import { finalPrice, products, type Product } from "../productsPage/productsData";

export function useCartLines() {
  return useAppSelector((state) => state.cart.lines);
}

export function useCartCount(): number {
  const lines = useCartLines();
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

export interface ResolvedCartLine {
  productId: number;
  quantity: number;
  product: Product;
  lineTotal: number;
}

export function useResolvedCart(): ResolvedCartLine[] {
  const lines = useCartLines();
  const resolved: ResolvedCartLine[] = [];
  for (const l of lines) {
    const product = products[l.productId];
    if (!product) continue;
    resolved.push({
      productId: l.productId,
      quantity: l.quantity,
      product,
      lineTotal: finalPrice(product) * l.quantity,
    });
  }
  return resolved;
}

export function useCartSubtotal(): number {
  return useResolvedCart().reduce((sum, l) => sum + l.lineTotal, 0);
}

/** Free at/above this subtotal; below it, delivery is paid to the courier
 * on pickup — never added to the checkout total. */
export const FREE_DELIVERY_THRESHOLD = 500000;

export function isFreeDelivery(subtotal: number): boolean {
  return subtotal >= FREE_DELIVERY_THRESHOLD;
}
