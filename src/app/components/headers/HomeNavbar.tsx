import { NavLink } from "react-router-dom";
import { Basket } from "./Basket";
import { AccountMenu } from "./AccountMenu";
import "../../../css/navbar.css";

export function HomeNavbar() {
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
          <AccountMenu />
        </div>
      </div>
    </nav>
  );
}
