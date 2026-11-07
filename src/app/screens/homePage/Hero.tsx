import { Link } from "react-router-dom";
import { useI18n } from "../../../lib/i18n";
import { rich } from "../../../lib/i18n/rich";

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
  const { t } = useI18n();
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-inner">
        <div className="copy">
          <h2>{rich(t("hero.title"))}</h2>
          <p>{t("hero.text")}</p>
          <div className="cta-row">
            <Link to="/products?category=bestseller" className="btn-ink">
              {t("hero.shopBest")}
            </Link>
            <Link to="/products?category=skincare" className="btn-outline">
              {t("hero.discover")}
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
