import type { TutorialPlatform, TutorialStatus } from "../enums/tutorial.enum";
import type { Product } from "./product";

/**
 * Mirrors the backend type (k-glow/src/libs/types/tutorial.ts). The video
 * itself is never hosted by us — `tutorialEmbedId` addresses it on the
 * original platform. `tutorialThumbnail` is best-effort: YouTube's public
 * oEmbed fills it in at creation time, Instagram has none.
 */
export interface Tutorial {
  _id: string;
  tutorialTitle: string;
  tutorialPlatform: TutorialPlatform;
  tutorialUrl: string;
  tutorialEmbedId: string;
  tutorialThumbnail?: string;
  /** What the video is selling. The brand is always set; the product is the
   *  precise link, only present when the admin picked one. */
  tutorialBrand: string;
  tutorialProductId?: string;
  tutorialStatus: TutorialStatus;
  tutorialViews: number;
  createdAt: string;
  updatedAt: string;
  /** From the backend's $lookup — empty when no product is linked, or when
   *  the linked one has since been deleted. Always an array, like reviews. */
  productData?: Product[];
}
