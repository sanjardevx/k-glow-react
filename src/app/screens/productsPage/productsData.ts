import type { Product } from "../../../lib/types/product";

/** `165000` → `"165,000 so'm"`. */
export function formatPrice(value: number): string {
  const withSeparators = Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${withSeparators} so'm`;
}

/**
 * What the customer actually pays: the original price with the discount
 * percentage applied. Products without a discount pay the full price.
 */
export function finalPrice(
  product: Pick<Product, "productPrice" | "productDiscount">,
): number {
  if (!product.productDiscount) return product.productPrice;
  return Math.round(
    (product.productPrice * (100 - product.productDiscount)) / 100,
  );
}
