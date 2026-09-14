import { Link } from "react-router-dom";
import { TELEGRAM_URL } from "../../../lib/config";
import { BoltIcon, BoxIcon, ShieldIcon, TruckIcon } from "../icons";
import "../../../css/footer.css";

/**
 * "AI Beauty" mirrors the navbar placeholder: an approved label for a page
 * that is not built yet, rendered inert until it exists.
 */
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand + trust are two separate grid items (not one stacked
              column) so narrow layouts can place trust next to Shop —
              see the grid-template-areas in footer.css. */}
          <div className="footer-col footer-col-brand">
            <p className="footer-brand">
              K-glow <em>secrets</em>
            </p>
            <p className="footer-about">
              Authentic Korean skincare and makeup, sourced directly from Seoul
              and delivered across Uzbekistan.
            </p>
          </div>
          <ul className="footer-trust footer-col-trust">
            <li>
              <TruckIcon />
              Shipped from Korea
            </li>
            <li>
              <ShieldIcon />
              100% authentic
            </li>
            <li>
              <BoxIcon />
              Usually in stock
            </li>
            <li>
              <BoltIcon />
              Same-day dispatch via BTS post
            </li>
          </ul>
          <div className="footer-col footer-col-shop">
            <h5>Shop</h5>
            <Link to="/">Home</Link>
            <Link to="/products">Shop</Link>
            <Link to="/live-tutorials">Live Tutorials</Link>
            <a
              href="#"
              className="placeholder"
              aria-disabled="true"
              title="Coming soon"
              onClick={(e) => e.preventDefault()}
            >
              AI Beauty
            </a>
            <Link to="/help">Help</Link>
          </div>
          <div className="footer-col footer-col-findus">
            <h5>Find us</h5>
            <p>Tashkent, Uzbekistan</p>
            <p>+998 94 290 03 26</p>
            <p>hello@kglowsecrets.uz</p>
          </div>
          <div className="footer-col footer-col-loop">
            <h5>Stay in the loop</h5>
            <p>New arrivals, restocks, discount events.</p>
            <a
              className="footer-cta"
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join our Telegram →
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© K-Glow Secrets</span>
          <span>Instagram · Telegram</span>
        </div>
      </div>
    </footer>
  );
}
