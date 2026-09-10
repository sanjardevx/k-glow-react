import { useEffect } from "react";

/**
 * Freezes the page behind a modal while `locked` is true, so a scroll gesture
 * that runs past the modal's own edge can't drag the page underneath. Locks
 * both <html> and <body> — browsers differ on which one actually scrolls — and
 * restores whatever was there before on unlock.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const root = document.documentElement;
    const prevRoot = root.style.overflow;
    const prevBody = document.body.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      root.style.overflow = prevRoot;
      document.body.style.overflow = prevBody;
    };
  }, [locked]);
}
