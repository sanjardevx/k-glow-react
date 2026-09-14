import type { TutorialPlatform, TutorialStatus } from "../enums/tutorial.enum";

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
  tutorialStatus: TutorialStatus;
  tutorialViews: number;
  createdAt: string;
  updatedAt: string;
}
