import { Link } from "react-router-dom";
import { TELEGRAM_CHANNEL_URL, TELEGRAM_URL } from "../../../lib/config";
import { BoltIcon, BoxIcon, ShieldIcon, TruckIcon } from "../icons";
import { useI18n } from "../../../lib/i18n";
import "../../../css/footer.css";

export function Footer() {
  const { t } = useI18n();
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
            <p className="footer-about">{t("footer.about")}</p>
          </div>
          <ul className="footer-trust footer-col-trust">
            <li>
              <TruckIcon />
              {t("trust.shipped")}
            </li>
            <li>
              <ShieldIcon />
              {t("trust.authentic")}
            </li>
            <li>
              <BoxIcon />
              {t("trust.inStock")}
            </li>
            <li>
              <BoltIcon />
              {t("trust.dispatch")}
            </li>
          </ul>
          <div className="footer-col footer-col-shop">
            <h5>{t("footer.shop")}</h5>
            <Link to="/">{t("nav.home")}</Link>
            <Link to="/products">{t("nav.shop")}</Link>
            <Link to="/live-tutorials">{t("nav.tutorials")}</Link>
            <Link to="/ai-beauty">{t("nav.aiBeauty")}</Link>
            <Link to="/help">{t("nav.help")}</Link>
          </div>
          <div className="footer-col footer-col-findus">
            <h5>{t("footer.findUs")}</h5>
            <p>{t("footer.city")}</p>
            {/* Telegram rather than a phone number and a mailbox: it is where
                the shop actually replies, and it is one tap on the phone most
                of this traffic arrives on. Carries the same accent colour as
                the channel link below — both leave the site, and neither is
                ordinary navigation. */}
            <a
              className="footer-accent"
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("footer.messageUs")}
            </a>
          </div>
          <div className="footer-col footer-col-loop">
            <h5>{t("footer.loop")}</h5>
            <p>{t("footer.loopText")}</p>
            <a
              className="footer-cta"
              href={TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("footer.join")}
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
