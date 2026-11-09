import type { Routine } from "../../../lib/types/routine";

/** Each product once, in the order it's first used. */
export function routineProducts(routine: Routine) {
  const seen = new Set<string>();
  return [...routine.morning, ...routine.evening]
    .map((s) => s.product)
    .filter((p) => {
      const id = String(p._id);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
}
