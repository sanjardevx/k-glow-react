import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Basket } from "./Basket";
import { AccountLink, LogoutButton } from "./AccountLink";
import type { AuthMode } from "../auth";
import { useGlobals } from "../../context/useGlobals";
import { useI18n } from "../../../lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UserIcon } from "../icons";
import "../../../css/navbar.css";

interface NavbarContentProps {
  onAuthOpen: (mode: AuthMode) => void;
}

/**
 * The navbar itself. HomeNavbar and OtherNavbar both render this — App.tsx
 * still picks between the two by route, so any future difference between
 * them (a taller home header, say) has a place to live without duplicating
 * the links and header tools again.
 */
export function NavbarContent({ onAuthOpen }: NavbarContentProps) {
  const { authMember } = useGlobals();
  const { t } = useI18n();
  const scrolled = useScrolled();

  return (
    <nav className={`nav${scrolled ? " is-scrolled" : ""}`} aria-label="Main">
      <div className="nav-inner">
        <NavLink to="/" className="logo">
          K-glow <em>secrets</em>
        </NavLink>
        <div className="links">
          <NavLink to="/" exact activeClassName="active">
            {t("nav.home")}
          </NavLink>
          <NavLink to="/products" activeClassName="active">
            {t("nav.shop")}
          </NavLink>
          {/* Phone only: there the header tools drop their labels, so
              the words "My Page" live here instead — second in the row, so
              they are on screen before the row is scrolled sideways. */}
          {authMember ? (
            <NavLink
              to="/member-page"
              activeClassName="active"
              className="nav-link-phone"
            >
              {t("account.myPage")}
            </NavLink>
          ) : null}
          <NavLink to="/live-tutorials" activeClassName="active">
            {t("nav.tutorials")}
          </NavLink>
          <NavLink to="/ai-beauty" activeClassName="active">
            {t("nav.aiBeauty")}
          </NavLink>
          <NavLink to="/help" activeClassName="active">
            {t("nav.help")}
          </NavLink>
        </div>
        <div className="right">
          <LanguageSwitcher />
          <Basket />
          {authMember ? (
            <>
              <AccountLink />
              <LogoutButton />
            </>
          ) : (
            // One door for both: the sign-in window links to sign-up, and the
            // home page's sale banner asks for sign-ups on its own.
            <button
              type="button"
              className="nav-tool"
              onClick={() => onAuthOpen("login")}
            >
              <UserIcon className="nav-tool-icon" />
              <span className="nav-tool-label">{t("nav.login")}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

/**
 * True once the page has scrolled under the header — the glass turns on.
 * Set on every scroll event without throttling: the value only flips at the
 * threshold, and React skips the render when it hasn't changed.
 */
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(() => window.scrollY > threshold);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
