import { useEffect, useState, type CSSProperties } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { AuthMode } from "./auth";
import { useGlobals } from "../context/useGlobals";
import { useI18n } from "../../lib/i18n";
import {
  HomeIcon,
  ShopIcon,
  SparkleIcon,
  UserIcon,
  VideoIcon,
} from "./icons";
import "../../css/bottom-bar.css";

interface BottomBarProps {
  onAuthOpen: (mode: AuthMode) => void;
}

/** Which tab a path belongs to, or -1 for pages that aren't one (Help, the bag). */
function activeTab(pathname: string): number {
  if (pathname === "/") return 0;
  if (pathname.startsWith("/products")) return 1;
  if (pathname.startsWith("/live-tutorials")) return 2;
  if (pathname.startsWith("/ai-beauty")) return 3;
  if (pathname === "/member-page" || pathname === "/orders") return 4;
  return -1;
}

/**
 * The phone's main navigation: a floating bar of frosted glass along the
 * bottom, where a thumb reaches it — the shape iOS 26 gives its own tab bars.
 * A glass "lens" sits under the current tab and slides to the next one, so
 * the move reads as one object travelling rather than one highlight going
 * out and another coming on.
 *
 * Five tabs, the most a bottom bar should hold: Home, Shop, Tutorials,
 * AI Beauty and the shopper's account. The bag lives in the header beside
 * search; Help is in the My Page menu. It stays on every page — on the
 * product and bag pages their buy bar floats just above it.
 *
 * Scrolling down slims it (labels fade, the bar settles a little lower) to
 * give the page more room; scrolling up brings it back.
 *
 * Hidden above 860px, where the header's own links do this job.
 */
export function BottomBar({ onAuthOpen }: BottomBarProps) {
  const { authMember } = useGlobals();
  const { t } = useI18n();
  const { pathname } = useLocation();
  const compact = useCompactOnScroll();
  const active = activeTab(pathname);

  return (
    <nav
      className={`tabbar${compact ? " is-compact" : ""}`}
      aria-label={t("tab.aria")}
    >
      <span
        className={`tab-lens${active === -1 ? " is-hidden" : ""}`}
        style={{ "--tab-index": Math.max(active, 0) } as CSSProperties}
        aria-hidden="true"
      />
      <NavLink to="/" exact className="tab" activeClassName="active">
        <HomeIcon className="tab-icon" />
        <span className="tab-label">{t("nav.home")}</span>
      </NavLink>
      <NavLink to="/products" className="tab" activeClassName="active">
        <ShopIcon className="tab-icon" />
        <span className="tab-label">{t("nav.shop")}</span>
      </NavLink>
      <NavLink to="/live-tutorials" className="tab" activeClassName="active">
        <VideoIcon className="tab-icon" />
        <span className="tab-label">{t("tab.video")}</span>
      </NavLink>
      <NavLink to="/ai-beauty" className="tab" activeClassName="active">
        <SparkleIcon className="tab-icon" />
        <span className="tab-label">{t("nav.aiBeauty")}</span>
      </NavLink>
      {authMember ? (
        <NavLink
          to="/member-page"
          className="tab"
          activeClassName="active"
          isActive={(match, location) =>
            Boolean(match) || location.pathname === "/orders"
          }
        >
          <UserIcon className="tab-icon" />
          <span className="tab-label">{t("tab.me")}</span>
        </NavLink>
      ) : (
        <button type="button" className="tab" onClick={() => onAuthOpen("login")}>
          <UserIcon className="tab-icon" />
          <span className="tab-label">{t("nav.login")}</span>
        </button>
      )}
    </nav>
  );
}

/**
 * True while the shopper is scrolling down the page, past the first screen;
 * false again the moment they scroll up or reach the top. A few pixels of
 * jitter either way is not a change of direction.
 */
function useCompactOnScroll() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 8) return;
      setCompact(y > lastY && y > 120);
      lastY = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return compact;
}
