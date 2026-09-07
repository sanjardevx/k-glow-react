import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

const stats = [
  { value: 15, suffix: "+", label: "Brands carried" },
  { value: 250, suffix: "+", label: "Products" },
  { value: 1000, suffix: "+", label: "Happy customers" },
  { value: 3, suffix: "", label: "Years in business" },
];

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function Statistics() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const startedRef = useRef(false);
  const [started, setStarted] = useState(false);
  const [counts, setCounts] = useState(() => stats.map(() => 0));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setCounts(stats.map((s) => s.value));
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        setStarted(true);
        observer.disconnect();

        const duration = 1600;
        const startTime = performance.now();

        function tick(now: number) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = easeInOutCubic(progress);
          setCounts(stats.map((s) => Math.round(s.value * eased)));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats" ref={sectionRef}>
      <Box className="stats-grid">
        {stats.map((s, i) => (
          <Box
            className={`stat-tile${started ? " in-view" : ""}`}
            key={s.label}
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <Box className="stat-num">
              {counts[i]}
              {s.suffix}
            </Box>
            <Box className="stat-label">{s.label}</Box>
          </Box>
        ))}
      </Box>
    </section>
  );
}
