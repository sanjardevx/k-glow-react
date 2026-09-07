/**
 * Hero. The soft, full-width backdrop is the banner photo itself, blurred and
 * washed with cream (see .hero-bg in home.css) so the sharp copy of the photo
 * on the right sits inside one continuous scene rather than on a flat block.
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
            <button type="button" className="btn-ink">
              Shop Bestsellers
            </button>
            <button type="button" className="btn-outline">
              Discover Skincare
            </button>
          </div>
        </div>
        <div className="hero-photo">
          <img src="/img/hero-banner.webp" alt="K-Glow Secrets" />
        </div>
      </div>
    </section>
  );
}
