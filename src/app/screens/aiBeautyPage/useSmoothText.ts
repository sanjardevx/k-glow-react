import { useCallback, useEffect, useRef, useState } from "react";

/** Slowest pace, in characters a second; faster when text piles up. */
const MIN_RATE = 45;
/** How many seconds of waiting text to catch up on, at most. */
const CATCH_UP_SECONDS = 0.35;
/** Longest wait for the text to finish showing (a hidden tab pauses it). */
const MAX_WAIT_MS = 2000;

/**
 * Shows streamed text at an even pace. The AI's reply arrives in uneven
 * bursts — a word, then five at once — so writing each burst out as it lands
 * looks jerky. This reveals it a few characters per frame instead, speeding
 * up when text piles up so it never falls far behind.
 *
 * Returns the text to show now, and `waitUntilShown(text)`, which resolves
 * once that text is fully on screen. Text that doesn't continue what is
 * shown (a reply being rewritten) starts over. With reduced motion turned
 * on, text shows at once.
 */
export function useSmoothText(target: string) {
  const [shown, setShown] = useState(target);
  const shownRef = useRef(target);
  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    if (!target.startsWith(shownRef.current)) {
      shownRef.current = "";
      setShown("");
    }

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      shownRef.current = target;
      setShown(target);
      return;
    }

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const goal = targetRef.current;
      const backlog = goal.length - shownRef.current.length;
      if (backlog <= 0) return;
      const rate = Math.max(MIN_RATE, backlog / CATCH_UP_SECONDS);
      const step = Math.max(1, Math.round((rate * (now - last)) / 1000));
      last = now;
      shownRef.current = goal.slice(0, shownRef.current.length + step);
      setShown(shownRef.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  const waitUntilShown = useCallback(
    (text: string) =>
      new Promise<void>((resolve) => {
        const started = Date.now();
        const check = () => {
          if (shownRef.current.length >= text.length || Date.now() - started > MAX_WAIT_MS)
            resolve();
          else setTimeout(check, 50);
        };
        check();
      }),
    [],
  );

  return { text: shown, waitUntilShown };
}
