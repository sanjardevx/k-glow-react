import type { KeyboardEvent } from "react";

/**
 * Enter/Space activation for a non-button element carrying role="button"
 * (a span/div standing in for a <button> because it sits inside an <a> or
 * needs layout a real button can't give it). Pass the same handler used
 * for onClick.
 */
export function onActivateKey(handler: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handler();
    }
  };
}
