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

/** The type of step, which picks its picture. */
export type StepKind =
  | "cleanser"
  | "oil_cleanser"
  | "toner"
  | "essence"
  | "serum"
  | "eye_cream"
  | "moisturizer"
  | "sunscreen"
  | "mask"
  | "exfoliant"
  | "spot_treatment"
  | "other";

export interface RoutineStep {
  kind?: StepKind;
  step: string;
  why: string;
  howToUse: string;
  product: Product;
}

/** The quiz answers a routine was built from, kept with it. */
export type RoutineAnswers = Pick<
  RoutineRequest,
  "skinType" | "concerns" | "sensitive" | "size"
>;

export interface Routine {
  summary: string;
  tips: string[];
  seeDermatologist: boolean;
  morning: RoutineStep[];
  evening: RoutineStep[];
  answers: RoutineAnswers;
  createdAt: string;
  /** Answers left today, sent back with a freshly built routine. */
  left?: number;
}

/** GET /ai/status: today's allowance and the member's saved routine. */
export interface AiStatus {
  limit: number;
  left: number;
  routine: Routine | null;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  /** Product cards the assistant suggested with its answer. */
  products?: Product[];
}

export interface ChatAnswer {
  reply: string;
  products: Product[];
  left: number;
}

/** What a streamed chat sends while the answer is being written. */
export type ChatStreamEvent =
  | { type: "tools"; names: string[] }
  | { type: "reply"; text: string }
  | { type: "reset" };
