import { useEffect, useRef } from "react";

/**
 * Scroll reveal. Attach the returned ref to an element that carries the
 * `reveal` class; once it scrolls into view the hook adds `is-visible` and
 * the CSS in components.css animates it in. Runs once per element.
 *
 * Adding the class directly on the DOM node keeps this free of re-renders,
 * and React leaves the attribute alone because the `className` prop it
 * rendered has not changed. Reduced-motion users get the element shown
 * immediately, with no observer.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-visible");
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
