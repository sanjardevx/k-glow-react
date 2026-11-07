import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import ProductService from "../../services/ProductService";
import { useI18n, type TKey } from "../../../lib/i18n";

interface Stat {
  value: number;
  suffix: string;
  label: TKey;
}

/**
 * Brands and products are counted from the catalog (GET /product/stats), so
 * the homepage can't promise "250+ products" over a shop that lists 50. The
 * other two aren't in the database and are the shop's own figures — keep them
 * honest by hand.
 */
const fixedStats: Stat[] = [
  { value: 1000, suffix: "+", label: "stats.customers" },
  { value: 3, suffix: "", label: "stats.years" },
];

/** Drawn while the counts load, so the section has its full height from the
 *  first paint instead of jumping open when they arrive. */
const loadingStats: Stat[] = [
  { value: 0, suffix: "", label: "stats.brands" },
  { value: 0, suffix: "", label: "stats.products" },
  ...fixedStats,
];

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function Statistics() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [stats, setStats] = useState<Stat[] | null>(null);
  const [inView, setInView] = useState(false);
  const [counts, setCounts] = useState<number[]>([]);
  const { t } = useI18n();

  useEffect(() => {
    let cancelled = false;
    new ProductService()
      .getCatalogStats()
      .then(({ brandCount, productCount }) => [
        { value: brandCount, suffix: "", label: "stats.brands" as const },
        { value: productCount, suffix: "", label: "stats.products" as const },
        ...fixedStats,
      ])
      // Without the live counts, show only what's known rather than guess.
      .catch(() => fixedStats)
      .then((list) => {
        if (!cancelled) setStats(list);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Counts up once both are true: the section is on screen and the figures
  // have arrived — whichever comes second starts it.
  useEffect(() => {
    if (!stats || !inView) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setCounts(stats.map((s) => s.value));
      return;
    }

    const duration = 1600;
    const startTime = performance.now();
    let frame = requestAnimationFrame(function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easeInOutCubic(progress);
      setCounts(stats.map((s) => Math.round(s.value * eased)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [stats, inView]);

  const started = Boolean(stats && inView);

  return (
    <section className="stats" ref={sectionRef}>
      <Box className="stats-grid">
        {(stats ?? loadingStats).map((s, i) => (
          <Box
            className={`stat-tile${started ? " in-view" : ""}`}
            key={s.label}
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <Box className="stat-num">
              {counts[i] ?? 0}
              {s.suffix}
            </Box>
            <Box className="stat-label">{t(s.label)}</Box>
          </Box>
        ))}
      </Box>
    </section>
  );
}
