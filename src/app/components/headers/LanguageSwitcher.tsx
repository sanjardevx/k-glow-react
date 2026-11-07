import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { LANGUAGES, useI18n } from "../../../lib/i18n";
import { CheckIcon, GlobeIcon } from "../icons";

/**
 * UZ / RU / EN in the header: the globe opens a small menu drawn like the
 * rest of the site — a cream card that grows out of the globe and folds back
 * into it, each language written in its own script, the current one ticked.
 *
 * Behaves as a menu should: Escape or a tap outside closes it, the arrow
 * keys move between languages, and focus goes back to the globe on close.
 */
export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = LANGUAGES.find((option) => option.code === lang);

  function close(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    // Start on the language already chosen, so Enter keeps it.
    itemRefs.current[LANGUAGES.findIndex((o) => o.code === lang)]?.focus();

    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    }
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") close(true);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function onMenuKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = itemRefs.current;
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const step = e.key === "ArrowDown" ? 1 : -1;
    items[(index + step + items.length) % items.length]?.focus();
  }

  return (
    <div className="nav-lang" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`nav-tool${open ? " active" : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("nav.language")}
        onClick={() => setOpen((v) => !v)}
      >
        <GlobeIcon className="nav-tool-icon" />
        <span className="nav-tool-label" aria-hidden="true">
          {current?.short}
        </span>
      </button>

      <div
        className={`lang-menu${open ? " is-open" : ""}`}
        role="menu"
        aria-label={t("nav.language")}
        inert={!open}
        onKeyDown={onMenuKeyDown}
      >
        {LANGUAGES.map((option, i) => {
          const selected = option.code === lang;
          return (
            <button
              key={option.code}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              type="button"
              role="menuitemradio"
              aria-checked={selected}
              lang={option.code}
              className={`lang-item${selected ? " is-selected" : ""}`}
              onClick={() => {
                setLang(option.code);
                close(true);
              }}
            >
              <span className="lang-code" aria-hidden="true">
                {option.short}
              </span>
              <span className="lang-name">{option.name}</span>
              {selected ? <CheckIcon className="lang-check" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
