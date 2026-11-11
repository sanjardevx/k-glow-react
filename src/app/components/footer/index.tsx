import { Link } from "react-router-dom";
import { TELEGRAM_CHANNEL_URL, TELEGRAM_URL } from "../../../lib/config";
import {
  BoltIcon,
  BoxIcon,
  MailIcon,
  PhoneIcon,
  SendIcon,
  ShieldIcon,
  TruckIcon,
} from "../icons";
import { useI18n } from "../../../lib/i18n";
import "../../../css/footer.css";

/** The shop's direct contacts: Uzbekistan and Korea numbers, and email. */
const CONTACTS = [
  { href: "tel:+998938900326", label: "+998 93 890 03 26", Icon: PhoneIcon },
  { href: "tel:+821043930340", label: "+82 10 4393 0340", Icon: PhoneIcon },
  { href: "mailto:sanjardevx@gmail.com", label: "sanjardevx@gmail.com", Icon: MailIcon },
];

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand, three link columns, then the trust lines as one row
              across the bottom — see the grid-template-areas in footer.css. */}
          <div className="footer-col footer-col-brand">
            {/* The shop's logo exactly as on Telegram and its ads, drawn in
                cream to sit on the dark footer. */}
            <img
              src="/icons/logo-full-light.svg"
              alt="K-glow secrets"
              className="footer-logo"
            />
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
            <ul className="footer-contacts">
              {CONTACTS.map(({ href, label, Icon }) => (
                <li key={href}>
                  <a href={href}>
                    <Icon />
                    {label}
                  </a>
                </li>
              ))}
              <li>
                {/* Where the shop actually replies fastest; same accent as the
                    channel link — both leave the site for Telegram. */}
                <a
                  className="footer-accent"
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SendIcon />
                  {t("footer.messageUs")}
                </a>
              </li>
            </ul>
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
          {/* Both on the left: the floating Telegram button sits over the
              right end of this band. */}
          <span>© K-Glow Secrets</span>
          <span aria-hidden="true">·</span>
          <Link to="/privacy" className="footer-legal">
            {t("footer.privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
