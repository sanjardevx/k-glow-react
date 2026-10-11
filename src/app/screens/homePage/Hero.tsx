import { Link } from "react-router-dom";

/**
 * Hero. The soft, full-width backdrop is the banner photo itself, blurred and
 * washed with cream (see .hero-bg in home.css) so the sharp copy of the photo
 * on the right sits inside one continuous scene rather than on a flat block.
 *
 * Both calls to action are links, not buttons: they only navigate, so they
 * open in a new tab on a middle-click and show their target in the status bar
 * like any other link. The shop reads `?category=` on mount, which is why a
 * plain href is enough to land on the right chip.
 */
export function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-inner">
        <div className="copy">
          <h2>
            Authentic K-beauty,
            <br />
            <em>delivered to you.</em>
          </h2>
          <p>
            Sourced directly from Korea — the same skincare and makeup brands
            trending in Seoul, now in Tashkent.
          </p>
          <div className="cta-row">
            <Link to="/products?category=bestseller" className="btn-ink">
              Shop Bestsellers
            </Link>
            <Link to="/products?category=skincare" className="btn-outline">
              Discover Skincare
            </Link>
          </div>
        </div>
        <div className="hero-photo">
          <img src="/img/hero-banner.webp" alt="K-Glow Secrets" />
        </div>
      </div>
    </section>
  );
}
