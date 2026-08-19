/**
 * Mock reviews shaped to match the real backend Review model:
 * { productId, reviewerName, reviewText, reviewStars, reviewStatus }.
 *
 * Reviews are TEXT ONLY — the screenshot images under public/img/reviews/ are
 * no longer referenced by the UI.
 */

/**
 * Matches ReviewStatus in k-glow/src/libs/enums/review.enum.ts.
 * Only ACTIVE reviews are shown to customers; HIDDEN lets the admin pull a
 * review off the site without deleting it.
 */
export type ReviewStatus = "ACTIVE" | "HIDDEN";

export interface Review {
  /** Matches the mock product's array index; becomes a real `_id` later. */
  productId: string;
  reviewerName: string;
  reviewText: string;
  /** 1–5 */
  reviewStars: number;
  reviewStatus: ReviewStatus;
}

export const reviews: Review[] = [
  // 0 — COSRX Advanced Snail 96 Mucin Power Essence
  {
    productId: "0",
    reviewerName: "Nilufar A.",
    reviewText:
      "My skin drank this up. Two weeks in and the dry patches around my nose are simply gone — it sinks in before I finish counting to ten.",
    reviewStars: 5,
    reviewStatus: "ACTIVE",
  },
  {
    productId: "0",
    reviewerName: "Kamola T.",
    reviewText:
      "I was worried it would feel slimy but it is barely there under sunscreen. The bottle lasts forever, so the price stops feeling scary.",
    reviewStars: 4,
    reviewStatus: "ACTIVE",
  },
  {
    productId: "0",
    reviewerName: "Anonim",
    reviewText:
      "Hidden while our team checks this one — it should never appear on the site.",
    reviewStars: 3,
    reviewStatus: "HIDDEN",
  },

  // 1 — Beauty of Joseon Glow Serum
  {
    productId: "1",
    reviewerName: "Dilnoza R.",
    reviewText:
      "The glow is real. My old acne marks faded noticeably after a month and I did not need to change anything else in my routine.",
    reviewStars: 5,
    reviewStatus: "ACTIVE",
  },
  {
    productId: "1",
    reviewerName: "Shahnoza M.",
    reviewText:
      "Light, a little sticky for the first minute, then perfect. It layers under makeup without pilling, which is all I ever wanted.",
    reviewStars: 5,
    reviewStatus: "ACTIVE",
  },

  // 2 — Anua Heartleaf Cleansing Oil
  {
    productId: "2",
    reviewerName: "Gulnora S.",
    reviewText:
      "It melts a full face of makeup in one pass and rinses clean — no film, no stinging eyes. My blackheads are visibly calmer.",
    reviewStars: 5,
    reviewStatus: "ACTIVE",
  },
  {
    productId: "2",
    reviewerName: "Malika I.",
    reviewText:
      "Gentle enough for my sensitive cheeks. I use it every evening and my skin has stopped feeling tight after cleansing.",
    reviewStars: 4,
    reviewStatus: "ACTIVE",
  },

  // 3 — rom&nd Juicy Lasting Tint
  {
    productId: "3",
    reviewerName: "Sevara B.",
    reviewText:
      "The colour survived lunch, tea and a whole workday. It looks like glass on the lips and never feels dry or cracked.",
    reviewStars: 5,
    reviewStatus: "ACTIVE",
  },
  {
    productId: "3",
    reviewerName: "Ozoda K.",
    reviewText:
      "I ordered one shade and came back for three more. Sheer when you dab it, bold when you build it — genuinely worth the hype.",
    reviewStars: 5,
    reviewStatus: "ACTIVE",
  },

  // 4 — Torriden Dive-In Serum
  {
    productId: "4",
    reviewerName: "Zilola N.",
    reviewText:
      "Pure hydration with nothing extra. It calmed the redness from my retinol nights and absorbed without any sticky finish.",
    reviewStars: 5,
    reviewStatus: "ACTIVE",
  },
  {
    productId: "4",
    reviewerName: "Feruza H.",
    reviewText:
      "Good everyday serum, especially at the sale price. Do not expect miracles — expect skin that never feels thirsty again.",
    reviewStars: 4,
    reviewStatus: "ACTIVE",
  },

  // 5 — VT Cosmetics Reedle Shot 100
  {
    productId: "5",
    reviewerName: "Madina Y.",
    reviewText:
      "You feel the tiny needles for about thirty seconds, then it settles. My texture smoothed out faster than with any acid I have tried.",
    reviewStars: 5,
    reviewStatus: "ACTIVE",
  },
  {
    productId: "5",
    reviewerName: "Rayhona D.",
    reviewText:
      "Started with two nights a week as advised. The tingling is odd at first but my pores look tighter, so I kept going.",
    reviewStars: 4,
    reviewStatus: "ACTIVE",
  },

  // 6 — Biodance Bio-Collagen Mask
  {
    productId: "6",
    reviewerName: "Lola A.",
    reviewText:
      "I wear it overnight before every event. In the morning my face is plump, bouncy and my makeup sits perfectly on top.",
    reviewStars: 5,
    reviewStatus: "ACTIVE",
  },
  {
    productId: "6",
    reviewerName: "Nodira Q.",
    reviewText:
      "It turns clear as it works, which is oddly satisfying. Expensive for one mask, but on a 30% discount I stock up.",
    reviewStars: 5,
    reviewStatus: "ACTIVE",
  },

  // 7 — Round Lab Dokdo Toner
  {
    productId: "7",
    reviewerName: "Aziza F.",
    reviewText:
      "The most boring toner in the best possible way. No fragrance, no sting, and my skin is quietly calmer every morning.",
    reviewStars: 4,
    reviewStatus: "ACTIVE",
  },
  {
    productId: "7",
    reviewerName: "Umida P.",
    reviewText:
      "I use it as a first step and sometimes soak a cotton pad for ten minutes. Big bottle, gentle formula, honest price.",
    reviewStars: 5,
    reviewStatus: "ACTIVE",
  },

  // 8 — Missha Dare Rouge Velvet Tint
  {
    productId: "8",
    reviewerName: "Charos E.",
    reviewText:
      "That soft blurred edge makes my lips look fuller without any liner. The orange is warm enough for our winter light.",
    reviewStars: 4,
    reviewStatus: "ACTIVE",
  },
  {
    productId: "8",
    reviewerName: "Nargiza O.",
    reviewText:
      "Velvet finish that does not dry me out by evening. I blot once and the colour is still there after dinner.",
    reviewStars: 4,
    reviewStatus: "ACTIVE",
  },

  // 9 — Missha Glow Layering Fit Cushion
  {
    productId: "9",
    reviewerName: "Sitora J.",
    reviewText:
      "One layer is a healthy glow, three layers cover everything. It never cakes and it does not slip off by mid-afternoon.",
    reviewStars: 5,
    reviewStatus: "ACTIVE",
  },
  {
    productId: "9",
    reviewerName: "Zarina V.",
    reviewText:
      "The shade matched me straight away. It settles slightly into my smile lines by evening, but a light powder fixes it.",
    reviewStars: 4,
    reviewStatus: "ACTIVE",
  },

  // 10 — Beauty of Joseon Hanbang Serum Discovery Kit
  {
    productId: "10",
    reviewerName: "Muattar G.",
    reviewText:
      "The smartest way to try the brand. I worked through all the minis and knew exactly which full size to order next.",
    reviewStars: 5,
    reviewStatus: "ACTIVE",
  },
  {
    productId: "10",
    reviewerName: "Diyora L.",
    reviewText:
      "Bought it as a gift and ended up keeping it. The packaging is beautiful and the sizes last a good two weeks each.",
    reviewStars: 5,
    reviewStatus: "ACTIVE",
  },

  // 11 — It's Skin Korean Beauty Glow Gift Set
  {
    productId: "11",
    reviewerName: "Sabina U.",
    reviewText:
      "Gave this to my sister and she messaged me photos of every single mask. Lovely value for the price.",
    reviewStars: 4,
    reviewStatus: "ACTIVE",
  },
  {
    productId: "11",
    reviewerName: "Iroda Z.",
    reviewText:
      "A nice little introduction to K-beauty. Nothing here is life-changing on its own, but together it makes a complete routine.",
    reviewStars: 4,
    reviewStatus: "ACTIVE",
  },
];

/** Only reviews the shop has approved for display. */
function published(list: Review[]): Review[] {
  return list.filter((review) => review.reviewStatus === "ACTIVE");
}

/** Published reviews for one product, in the order they were left. */
export function getReviewsForProduct(productId: string): Review[] {
  return published(reviews).filter((review) => review.productId === productId);
}

/**
 * Five-star published reviews for the Home page "Customer Love" strip —
 * at most one per product so the same item is not praised three times.
 */
export function getFeaturedReviews(count = 3): Review[] {
  const seen = new Set<string>();
  const featured: Review[] = [];

  for (const review of published(reviews)) {
    if (review.reviewStars !== 5 || seen.has(review.productId)) continue;
    seen.add(review.productId);
    featured.push(review);
    if (featured.length === count) break;
  }

  return featured;
}
