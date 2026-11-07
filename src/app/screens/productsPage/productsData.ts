import type { Product } from "../../../lib/types/product";
import { getLang, t } from "../../../lib/i18n";

/**
 * `165000` → `"165,000 so'm"` in English, `"165 000 so‘m"` / `"165 000 сум"`
 * in Uzbek and Russian, which group thousands with a space.
 */
export function formatPrice(value: number): string {
  const withSeparators = Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, getLang() === "en" ? "," : "\u00a0");
  return `${withSeparators} ${t("price.currency")}`;
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
