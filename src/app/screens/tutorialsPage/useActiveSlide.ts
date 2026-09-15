import { useEffect, useRef, useState } from "react";

/**
 * Tracks which slide of a snap-scrolling feed is currently on screen.
 *
 * The scroller itself is the observer's root (not the viewport), because the
 * feed scrolls inside its own box rather than moving the page. A slide
 * counts as active once 60% of it is visible, which with mandatory snap
 * means exactly one slide qualifies at rest and the hand-off happens
 * mid-swipe rather than at the very end of it.
 */
export function useActiveSlide<T extends HTMLElement>(slideCount: number) {
  const containerRef = useRef<T | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !slideCount) return;

    const slides = Array.from(
      container.querySelectorAll<HTMLElement>("[data-slide]"),
    );
    if (!slides.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // A fling can deliver several slides in one callback, and the
        // entries are not guaranteed to arrive in scroll order — taking the
        // last one would sometimes land on a slide the visitor has already
        // passed. The most-visible entry is the one actually on screen.
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry;
          }
        }
        if (!best) return;

        const index = Number((best.target as HTMLElement).dataset.slide);
        if (!Number.isNaN(index)) setActiveIndex(index);
      },
      { root: container, threshold: 0.6 },
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [slideCount]);

  return { containerRef, activeIndex };
}
