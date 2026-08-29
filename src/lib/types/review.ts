import type { ReviewStatus } from "../enums/review.enum";
import type { Product } from "./product";

/** Mirrors the backend type (k-glow/src/libs/types/review.ts). */
export interface Review {
  _id: string;
  productId: string;
  reviewerName: string;
  reviewText: string;
  reviewStars: number;
  reviewStatus: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  /** From the backend's aggregate $lookup — always an array, even for one match. */
  productData: Product[];
}
