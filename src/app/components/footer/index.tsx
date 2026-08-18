import { Link } from "react-router-dom";
import "../../../css/footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <h5>K-glow secrets</h5>
            <p>
              Authentic Korean skincare and makeup, sourced directly and
              delivered across Uzbekistan.
            </p>
            <div className="footer-trust">
              <div className="footer-trust-item">
                <span className="ic">🚚</span>Shipped from Korea
              </div>
              <div className="footer-trust-item">
                <span className="ic">🛡</span>100% authentic
              </div>
              <div className="footer-trust-item">
                <span className="ic">📦</span>Usually in stock
              </div>
              <div className="footer-trust-item">
                <span className="ic">⚡</span>Same-day dispatch via BTS post
              </div>
            </div>
          </div>
          <div className="footer-col">
            <h5>Shop</h5>
            <Link to="/">Home</Link>
            <Link to="/products">Shop</Link>
            <Link to="/products">Bestsellers</Link>
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
