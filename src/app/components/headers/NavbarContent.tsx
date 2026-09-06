import { NavLink } from "react-router-dom";
import { Basket } from "./Basket";
import { AccountMenu } from "./AccountMenu";
import type { AuthMode } from "../auth";
import { useGlobals } from "../../context/useGlobals";
import "../../../css/navbar.css";

interface NavbarContentProps {
  onAuthOpen: (mode: AuthMode) => void;
}

/**
 * The navbar itself. HomeNavbar and OtherNavbar both render this — App.tsx
 * still picks between the two by route, so any future difference between
 * them (a taller home header, say) has a place to live without duplicating
 * the links, basket and account menu again.
 *
 * "Live Tutorials" and "AI Beauty" are placeholders: the labels are part of
 * the approved design, the pages are not built yet, so they render as inert
 * links until their routes exist.
 */
export function NavbarContent({ onAuthOpen }: NavbarContentProps) {
  const { authMember } = useGlobals();

  return (
    <nav className="nav" aria-label="Main">
      <div className="nav-inner">
        <NavLink to="/" className="logo">
          K-glow <em>secrets</em>
        </NavLink>
        <div className="links">
          <NavLink to="/" exact activeClassName="active">
            Home
          </NavLink>
          <NavLink to="/products" activeClassName="active">
            Shop
          </NavLink>
          <a
            href="#"
            className="placeholder"
            aria-disabled="true"
            title="Coming soon"
            onClick={(e) => e.preventDefault()}
          >
            Live Tutorials
          </a>
          <a
            href="#"
            className="placeholder"
            aria-disabled="true"
            title="Coming soon"
            onClick={(e) => e.preventDefault()}
          >
            AI Beauty
          </a>
          <NavLink to="/help" activeClassName="active">
            Help
          </NavLink>
        </div>
        <div className="right">
          <Basket />
          {authMember ? (
            <AccountMenu />
          ) : (
            <>
              <button
                type="button"
                className="nav-login"
                onClick={() => onAuthOpen("login")}
              >
                Login
              </button>
              <button
                type="button"
                className="nav-auth-btn"
                onClick={() => onAuthOpen("signup")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
