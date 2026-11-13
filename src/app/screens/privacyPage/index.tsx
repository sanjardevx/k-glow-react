import { useEffect } from "react";
import { TELEGRAM_URL } from "../../../lib/config";
import { useI18n } from "../../../lib/i18n";
import { PRIVACY } from "./content";
import "../../../css/privacy.css";

/**
 * The privacy policy, in the visitor's language. Linked from the footer, and
 * from Google's sign-in screen, which needs one before the app can be used
 * by everyone.
 */
export function PrivacyPage() {
  const { lang, t } = useI18n();
  const text = PRIVACY[lang];

  useEffect(() => {
    const previous = document.title;
    document.title = `${text.title} — K-Glow Secrets`;
    return () => {
      document.title = previous;
    };
  }, [text.title]);

  return (
    <div className="privacy-page">
      <article className="privacy-container">
        <h1 className="privacy-title">{text.title}</h1>
        <p className="privacy-updated">{text.updated}</p>
        <p className="privacy-intro">{text.intro}</p>

        {text.sections.map((s) => (
          <section key={s.title} className="privacy-section">
            <h2>{s.title}</h2>
            <ul>
              {s.body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ))}

        <a className="privacy-contact" href={TELEGRAM_URL} target="_blank" rel="noreferrer">
          {t("footer.messageUs")} →
        </a>
      </article>
    </div>
  );
}
