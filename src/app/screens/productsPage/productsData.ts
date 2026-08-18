const CDN =
  "https://www.caretobeauty.com/cdn-cgi/image/w=600,h=600,sharpen=1,f=auto/media/catalog/product/";

export type Category = "SKINCARE" | "MAKEUP" | "SETS";

export interface Product {
  productBrand: string;
  productName: string;
  productPrice: string;
  productOldPrice?: string;
  productDiscount?: number;
  category: Category;
  isBestseller: boolean;
  stars: number;
  reviews: number;
  imagePath: string;
  description: string;
}

export const products: Product[] = [
  {
    productBrand: "COSRX",
    productName: "Advanced Snail 96 Mucin Power Essence",
    productPrice: "165,000 so'm",
    category: "SKINCARE",
    isBestseller: true,
    stars: 4,
    reviews: 128,
    imagePath:
      CDN + "c/o/cosrx-advanced-snail-96-mucin-power-essence-100ml.jpg",
    description:
      "A lightweight, fast-absorbing essence built around 96% snail secretion filtrate — hydrates, repairs, and smooths texture with daily use.",
  },
  {
    productBrand: "Beauty of Joseon",
    productName: "Glow Serum Propolis + Niacinamide",
    productPrice: "142,000 so'm",
    category: "SKINCARE",
    isBestseller: true,
    stars: 5,
    reviews: 94,
    imagePath:
      CDN + "b/e/beauty-of-joseon-glow-serum-propolis-niacinamide-30ml.jpg",
    description:
      "A lightweight, fast-absorbing serum with rice bran water and niacinamide — brightens tone and evens texture without stripping the skin's barrier.",
  },
  {
    productBrand: "Anua",
    productName: "Heartleaf Pore Control Cleansing Oil",
    productPrice: "128,000 so'm",
    category: "SKINCARE",
    isBestseller: true,
    stars: 4,
    reviews: 76,
    imagePath: CDN + "a/n/anua-heartleaf-pore-control-cleansing-oil-200ml.jpg",
    description:
      "A gentle cleansing oil formulated with 77% heartleaf extract — lifts makeup and sunscreen while calming and controlling excess pore oil.",
  },
  {
    productBrand: "rom&nd",
    productName: "Juicy Lasting Tint",
    productPrice: "98,000 so'm",
    category: "MAKEUP",
    isBestseller: true,
    stars: 5,
    reviews: 203,
    imagePath:
      CDN + "r/o/romand-the-juicy-lasting-tint-07-cherry-bomb-3-5g_1.jpg",
    description:
      "A glossy, juice-like tint that layers sheer to bold — long-wearing color with a comfortable, non-drying finish.",
  },
  {
    productBrand: "Torriden",
    productName: "Dive-In Serum",
    productPrice: "96,000 so'm",
    productOldPrice: "120,000",
    productDiscount: 20,
    category: "SKINCARE",
    isBestseller: false,
    stars: 4,
    reviews: 51,
    imagePath: CDN + "t/o/torriden-dive-in-serum-50ml.jpg",
    description:
      "A low-molecular hyaluronic acid serum that layers five weights of HA for deep, lasting hydration without a sticky finish.",
  },
  {
    productBrand: "VT Cosmetics",
    productName: "Reedle Shot 100",
    productPrice: "153,000 so'm",
    productOldPrice: "180,000",
    productDiscount: 15,
    category: "SKINCARE",
    isBestseller: false,
    stars: 4,
    reviews: 39,
    imagePath: CDN + "v/t/vt-cosmetics-cica-reedle-shot-100-essence-50ml.jpg",
    description:
      "A microneedle-textured cica essence that dissolves on contact — soothes irritation and supports the skin's barrier.",
  },
  {
    productBrand: "Biodance",
    productName: "Bio-Collagen Mask",
    productPrice: "84,000 so'm",
    productOldPrice: "120,000",
    productDiscount: 30,
    category: "SKINCARE",
    isBestseller: false,
    stars: 5,
    reviews: 167,
    imagePath: CDN + "b/i/biodance-bio-collagen-real-deep-mask-34g_1.jpg",
    description:
      "A hydrogel sheet mask that seals in a collagen-rich essence for a plump, dewy finish after a single 30-minute wear.",
  },
  {
    productBrand: "Round Lab",
    productName: "Dokdo Toner",
    productPrice: "99,000 so'm",
    productOldPrice: "110,000",
    productDiscount: 10,
    category: "SKINCARE",
    isBestseller: false,
    stars: 4,
    reviews: 28,
    imagePath: CDN + "r/o/round-lab-1025-dokdo-toner-100ml_1.png",
    description:
      "A mineral-rich toner formulated with deep sea water — balances and hydrates skin as the first step of a routine.",
  },
  {
    productBrand: "Missha",
    productName: "Dare Rouge Velvet Tint — Orange",
    productPrice: "89,000 so'm",
    category: "MAKEUP",
    isBestseller: false,
    stars: 4,
    reviews: 42,
    imagePath: CDN + "m/i/missha-dare-rouge-velvet-196-orange-3-5g.jpg",
    description:
      "A velvet-finish lip tint with a soft-focus, blurring texture — buildable color that stays comfortable through the day.",
  },
  {
    productBrand: "Missha",
    productName: "Glow Layering Fit Cushion",
    productPrice: "168,000 so'm",
    category: "MAKEUP",
    isBestseller: false,
    stars: 4,
    reviews: 65,
    imagePath:
      CDN + "m/i/missha-glow-layering-fit-cushion-21-vanilla-14g.jpg",
    description:
      "A lightweight cushion foundation that builds from a sheer glow to full coverage — layers without caking or settling into lines.",
  },
  {
    productBrand: "Beauty of Joseon",
    productName: "Hanbang Serum Discovery Kit",
    productPrice: "79,000 so'm",
    category: "SETS",
    isBestseller: false,
    stars: 5,
    reviews: 31,
    imagePath:
      CDN + "b/e/beauty-of-joseon-hanbang-serum-discovery-kit-1.webp",
    description:
      "A trial set of Beauty of Joseon's bestselling serums in travel sizes — the easiest way to find your favorite before committing to a full bottle.",
  },
  {
    productBrand: "It's Skin",
    productName: "Korean Beauty Glow Gift Set",
    productPrice: "69,000 so'm",
    category: "SETS",
    isBestseller: false,
    stars: 4,
    reviews: 19,
    imagePath: CDN + "i/t/it-s-skin-korean-beauty-glow-gift-set_1.jpg",
    description:
      "A curated gift set built around It's Skin's glow-boosting sheet masks and essentials — ready to give or keep for yourself.",
  },
];
