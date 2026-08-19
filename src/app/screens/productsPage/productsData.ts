const CDN =
  "https://www.caretobeauty.com/cdn-cgi/image/w=600,h=600,sharpen=1,f=auto/media/catalog/product/";

/** Mirrors the backend `ProductCategory` enum (k-glow/src/libs/enums/product.enum.ts). */
export type ProductCategory = "SKINCARE" | "MAKEUP" | "SETS";

/** Mirrors the backend `ProductStatus` enum. */
export type ProductStatus = "PAUSE" | "PROCESS" | "DELETE";

/**
 * Shaped to match the backend Mongoose schema (k-glow/src/schema/Product.model.ts)
 * so that swapping this mock array for a real API response is a drop-in change.
 *
 * Pricing rule (same as the backend):
 *   productPrice    = the ORIGINAL price
 *   productDiscount = percent off (e.g. 20 means 20% off)
 *   what the customer pays = finalPrice(product) — never store it twice.
 */
export interface Product {
  productBrand: string;
  productCategory: ProductCategory;
  productName: string;
  productPrice: number;
  productDiscount?: number;
  productDesc: string;
  productImages: string[];
  productViews: number;

  // TODO: `stars` and `reviews` are NOT in the backend Product schema yet.
  // They stay hardcoded on purpose until the Review model can supply an
  // average rating and a review count per product.
  stars: number;
  reviews: number;

  // Present on the backend but not mocked yet — optional so a real API
  // response still satisfies this interface.
  productStatus?: ProductStatus;
  productVolume?: string;
  productLeftCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * The full catalog as the backend would store it — including PAUSE (sold out,
 * still shown) and DELETE (soft-deleted, never shown) rows. `products` below
 * is the customer-facing view derived from this: DELETE rows are filtered out
 * once, here, so every screen that imports `products` gets that for free.
 */
const rawProducts: Product[] = [
  {
    productBrand: "COSRX",
    productName: "Advanced Snail 96 Mucin Power Essence",
    productPrice: 165000,
    productCategory: "SKINCARE",
    productStatus: "PROCESS",
    productViews: 1240,
    stars: 4,
    reviews: 128,
    productImages: [
      CDN + "c/o/cosrx-advanced-snail-96-mucin-power-essence-100ml.jpg",
    ],
    productDesc:
      "A lightweight, fast-absorbing essence built around 96% snail secretion filtrate — hydrates, repairs, and smooths texture with daily use.",
  },
  {
    productBrand: "Beauty of Joseon",
    productName: "Glow Serum Propolis + Niacinamide",
    productPrice: 142000,
    productCategory: "SKINCARE",
    productStatus: "PROCESS",
    productViews: 980,
    stars: 5,
    reviews: 94,
    productImages: [
      CDN + "b/e/beauty-of-joseon-glow-serum-propolis-niacinamide-30ml.jpg",
    ],
    productDesc:
      "A lightweight, fast-absorbing serum with rice bran water and niacinamide — brightens tone and evens texture without stripping the skin's barrier.",
  },
  {
    productBrand: "Anua",
    productName: "Heartleaf Pore Control Cleansing Oil",
    productPrice: 128000,
    productCategory: "SKINCARE",
    productStatus: "PROCESS",
    productViews: 870,
    stars: 4,
    reviews: 76,
    productImages: [
      CDN + "a/n/anua-heartleaf-pore-control-cleansing-oil-200ml.jpg",
    ],
    productDesc:
      "A gentle cleansing oil formulated with 77% heartleaf extract — lifts makeup and sunscreen while calming and controlling excess pore oil.",
  },
  {
    productBrand: "rom&nd",
    productName: "Juicy Lasting Tint",
    productPrice: 98000,
    productCategory: "MAKEUP",
    productStatus: "PROCESS",
    productViews: 1510,
    stars: 5,
    reviews: 203,
    productImages: [
      CDN + "r/o/romand-the-juicy-lasting-tint-07-cherry-bomb-3-5g_1.jpg",
    ],
    productDesc:
      "A glossy, juice-like tint that layers sheer to bold — long-wearing color with a comfortable, non-drying finish.",
  },
  {
    productBrand: "Torriden",
    productName: "Dive-In Serum",
    productPrice: 120000,
    productDiscount: 20,
    productCategory: "SKINCARE",
    productStatus: "PROCESS",
    productViews: 640,
    stars: 4,
    reviews: 51,
    productImages: [CDN + "t/o/torriden-dive-in-serum-50ml.jpg"],
    productDesc:
      "A low-molecular hyaluronic acid serum that layers five weights of HA for deep, lasting hydration without a sticky finish.",
  },
  {
    productBrand: "VT Cosmetics",
    productName: "Reedle Shot 100",
    productPrice: 180000,
    productDiscount: 15,
    productCategory: "SKINCARE",
    productStatus: "PROCESS",
    productViews: 520,
    stars: 4,
    reviews: 39,
    productImages: [
      CDN + "v/t/vt-cosmetics-cica-reedle-shot-100-essence-50ml.jpg",
    ],
    productDesc:
      "A microneedle-textured cica essence that dissolves on contact — soothes irritation and supports the skin's barrier.",
  },
  {
    productBrand: "Biodance",
    productName: "Bio-Collagen Mask",
    productPrice: 120000,
    productDiscount: 30,
    productCategory: "SKINCARE",
    productStatus: "PROCESS",
    productViews: 810,
    stars: 5,
    reviews: 167,
    productImages: [CDN + "b/i/biodance-bio-collagen-real-deep-mask-34g_1.jpg"],
    productDesc:
      "A hydrogel sheet mask that seals in a collagen-rich essence for a plump, dewy finish after a single 30-minute wear.",
  },
  {
    productBrand: "Round Lab",
    productName: "Dokdo Toner",
    productPrice: 110000,
    productDiscount: 10,
    productCategory: "SKINCARE",
    productStatus: "PROCESS",
    productViews: 430,
    stars: 4,
    reviews: 28,
    productImages: [CDN + "r/o/round-lab-1025-dokdo-toner-100ml_1.png"],
    productDesc:
      "A mineral-rich toner formulated with deep sea water — balances and hydrates skin as the first step of a routine.",
  },
  {
    productBrand: "Missha",
    productName: "Dare Rouge Velvet Tint — Orange",
    productPrice: 89000,
    productCategory: "MAKEUP",
    productStatus: "PROCESS",
    productViews: 360,
    stars: 4,
    reviews: 42,
    productImages: [CDN + "m/i/missha-dare-rouge-velvet-196-orange-3-5g.jpg"],
    productDesc:
      "A velvet-finish lip tint with a soft-focus, blurring texture — buildable color that stays comfortable through the day.",
  },
  {
    productBrand: "Missha",
    productName: "Glow Layering Fit Cushion",
    productPrice: 168000,
    productCategory: "MAKEUP",
    productStatus: "PROCESS",
    productViews: 295,
    stars: 4,
    reviews: 65,
    productImages: [
      CDN + "m/i/missha-glow-layering-fit-cushion-21-vanilla-14g.jpg",
    ],
    productDesc:
      "A lightweight cushion foundation that builds from a sheer glow to full coverage — layers without caking or settling into lines.",
  },
  {
    productBrand: "Beauty of Joseon",
    productName: "Hanbang Serum Discovery Kit",
    productPrice: 79000,
    productCategory: "SETS",
    productStatus: "PROCESS",
    productViews: 210,
    stars: 5,
    reviews: 31,
    productImages: [
      CDN + "b/e/beauty-of-joseon-hanbang-serum-discovery-kit-1.webp",
    ],
    productDesc:
      "A trial set of Beauty of Joseon's bestselling serums in travel sizes — the easiest way to find your favorite before committing to a full bottle.",
  },
  {
    productBrand: "It's Skin",
    productName: "Korean Beauty Glow Gift Set",
    productPrice: 69000,
    productCategory: "SETS",
    productStatus: "PROCESS",
    productViews: 150,
    stars: 4,
    reviews: 19,
    productImages: [CDN + "i/t/it-s-skin-korean-beauty-glow-gift-set_1.jpg"],
    productDesc:
      "A curated gift set built around It's Skin's glow-boosting sheet masks and essentials — ready to give or keep for yourself.",
  },
  {
    // PAUSE demo — stays visible, purchase actions disabled, "Sold Out" badge.
    productBrand: "COSRX",
    productName: "Advanced Snail Peptide Eye Cream",
    productPrice: 132000,
    productCategory: "SKINCARE",
    productStatus: "PAUSE",
    productViews: 205,
    stars: 5,
    reviews: 22,
    productImages: [
      CDN + "c/o/cosrx-advanced-snail-peptide-eye-cream-25ml-1.webp",
    ],
    productDesc:
      "A rich, peptide-infused eye cream built on the same snail mucin base as the essence — currently sold out while we wait on the next shipment from Korea.",
  },
  {
    // DELETE demo — proves the filter below actually removes it.
    productBrand: "rom&nd",
    productName: "Discontinued Tint (delisted)",
    productPrice: 45000,
    productCategory: "MAKEUP",
    productStatus: "DELETE",
    productViews: 40,
    stars: 3,
    reviews: 4,
    productImages: [
      CDN + "r/o/romand-the-juicy-lasting-tint-07-cherry-bomb-3-5g_1.jpg",
    ],
    productDesc: "Delisted by the brand — should never render anywhere.",
  },
];

/** Customer-facing catalog: DELETE rows never leave this module. */
export const products: Product[] = rawProducts.filter(
  (p) => p.productStatus !== "DELETE",
);

/** True when a product is paused (out of stock) — show "Sold Out", not badges/purchase actions. */
export function isSoldOut(product: Product): boolean {
  return product.productStatus === "PAUSE";
}

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

/** Sorted once — `products` is a static module-level array. */
const productsByViews = [...products].sort(
  (a, b) => b.productViews - a.productViews,
);

/** The most-viewed products. Replaces the old hardcoded `isBestseller` flag. */
export function getBestsellers(count = 4): Product[] {
  return productsByViews.slice(0, count);
}

/** True when this product is in the top `count` by `productViews`. */
export function isBestseller(product: Product, count = 4): boolean {
  return getBestsellers(count).includes(product);
}

/**
 * Mock products are identified by their array index. Keeping the lookup in one
 * place means switching to the backend's `_id` later is a one-function change.
 */
export function getProductById(id: string | number): Product | undefined {
  const index = Number(id);
  return Number.isInteger(index) ? products[index] : undefined;
}

/** The inverse of `getProductById` — the route id for a given product. */
export function getProductId(product: Product): string {
  return String(products.indexOf(product));
}
