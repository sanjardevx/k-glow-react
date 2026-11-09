import type { Product } from "./product";

export type SkinType = "dry" | "oily" | "combination" | "normal" | "unsure";
export type Concern =
  | "acne"
  | "dark_spots"
  | "dryness"
  | "redness"
  | "pores"
  | "aging";

/** The AI Beauty quiz, as POST /ai/routine takes it. */
export interface RoutineRequest {
  skinType: SkinType;
  concerns: Concern[];
  sensitive: boolean;
  size: "simple" | "full";
  note: string;
  lang: "uz" | "ru" | "en";
}

export interface RoutineStep {
  step: string;
  why: string;
  howToUse: string;
  product: Product;
}

export interface Routine {
  summary: string;
  tips: string[];
  seeDermatologist: boolean;
  morning: RoutineStep[];
  evening: RoutineStep[];
}
