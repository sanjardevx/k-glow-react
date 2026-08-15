import "../../../css/home.css";

export function Hero() {
  return (
    <section className="hero">
      <span className="blur b1"></span>
      <span className="blur b2"></span>
      <span className="blur b3"></span>
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
            <button className="btn-primary">Shop Bestsellers</button>
            <button className="btn-outline">Discover Skincare</button>
          </div>
        </div>
        <div className="hero-photo">
          <img src="/img/hero-banner.webp" alt="K-Glow Secrets" />
        </div>
      </div>
    </section>
  );
}
