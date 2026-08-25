import { NavLink } from "react-router-dom";
import { Basket } from "./Basket";
import { AccountMenu } from "./AccountMenu";
import type { AuthMode } from "../auth";
import type { Member } from "../../../lib/types/member";
import "../../../css/navbar.css";

interface HomeNavbarProps {
  onAuthOpen: (mode: AuthMode) => void;
}

export function HomeNavbar({ onAuthOpen }: HomeNavbarProps) {
  // Stays null until the login process lands — the logged-in branch below is
  // the account menu that's already built, waiting on a real session.
  const authMember: Member | null = null;

  return (
    <nav className="nav">
      <div className="nav-inner">
        <NavLink to="/" className="logo">
          K-glow secrets
        </NavLink>
        <div className="links">
          <NavLink to="/" exact activeClassName="active">
            Home
          </NavLink>
          <NavLink to="/products" activeClassName="active">
            Shop
          </NavLink>
          <NavLink to="/cart" activeClassName="active">
            Cart
          </NavLink>
          <NavLink to="/help" activeClassName="active">
            Help
          </NavLink>
        </div>
        <div className="right">
          <Basket />
          {authMember ? (
            <AccountMenu />
          ) : (
            <button
              type="button"
              className="nav-login-btn"
              onClick={() => onAuthOpen("login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
