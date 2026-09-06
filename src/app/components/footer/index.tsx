import { Link } from "react-router-dom";
import { TELEGRAM_URL } from "../../../lib/config";
import { BoltIcon, BoxIcon, ShieldIcon, TruckIcon } from "../icons";
import "../../../css/footer.css";

/**
 * "Live Tutorials" and "AI Beauty" mirror the navbar placeholders: approved
 * labels for pages that are not built yet, rendered inert until they exist.
 */
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <p className="footer-brand">
              K-glow <em>secrets</em>
            </p>
            <p className="footer-about">
              Authentic Korean skincare and makeup, sourced directly from Seoul
              and delivered across Uzbekistan.
            </p>
            <ul className="footer-trust">
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
          </div>
          <div className="footer-col">
            <h5>Shop</h5>
            <Link to="/">Home</Link>
            <Link to="/products">Shop</Link>
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
            <Link to="/help">Help</Link>
          </div>
          <div className="footer-col">
            <h5>Find us</h5>
            <p>Tashkent, Uzbekistan</p>
            <p>+998 94 290 03 26</p>
            <p>hello@kglowsecrets.uz</p>
          </div>
          <div className="footer-col">
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
