import { NavLink } from "react-router-dom";
import { Basket } from "./Basket";
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
          <NavLink to="/products" activeClassName="active">
            Bestsellers
          </NavLink>
          <NavLink to="/help" activeClassName="active">
            Help
          </NavLink>
        </div>
        <div className="right">
          <Basket />
          <button className="btn-signin">Sign Up</button>
        </div>
      </div>
    </nav>
  );
}
