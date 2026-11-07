import { LANGUAGES, useI18n, type Lang } from "../../../lib/i18n";
import { GlobeIcon } from "../icons";

/**
 * UZ / RU / EN in the header: a globe over the current code, drawn like the
 * other header tools. The real control is a native select stretched over it
 * — on a phone that opens the system picker, bigger and easier to hit than
 * anything drawn here.
 */
export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <label className="nav-tool nav-lang">
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        aria-label={t("nav.language")}
      >
        {LANGUAGES.map((option) => (
          <option key={option.code} value={option.code}>
            {option.name}
          </option>
        ))}
      </select>
      <GlobeIcon className="nav-tool-icon" />
      <span className="nav-tool-label" aria-hidden="true">
        {LANGUAGES.find((option) => option.code === lang)?.short}
      </span>
    </label>
  );
}
