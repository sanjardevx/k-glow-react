/**
 * A floating "chat with us" button, fixed to the viewport so it stays visible
 * on every page and the whole time the shopper scrolls — opens a 1:1 Telegram
 * chat with the shop's admin account in a new tab. Coloured with the brand's
 * sage rather than Telegram's own blue, so it reads as part of K-Glow rather
 * than a generic widget; the disc takes its fill from CSS (see app.css) so it
 * follows the tokens. Rendered once in App.tsx, outside the route Switch, so
 * it survives navigation instead of remounting (and restarting its spin
 * animation) on every page change.
 *
 * On a phone it sits over the content, so it tucks away while the shopper
 * scrolls down (reading, browsing a grid — where it covered Add to Cart) and
 * comes back the moment they scroll up or reach the end of the page.
 */
import { useEffect, useState } from "react";
import { TELEGRAM_URL } from "../../lib/config";

/** How far down before tucking starts — never on the first screen. */
const TUCK_AFTER = 240;

export function TelegramButton() {
  const [tucked, setTucked] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const atEnd =
          window.innerHeight + y >= document.documentElement.scrollHeight - 8;
        // A few pixels of jitter either way is not a change of direction.
        if (Math.abs(y - lastY) < 6) return;
        setTucked(y > lastY && y > TUCK_AFTER && !atEnd);
        lastY = y;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`telegram-fab${tucked ? " is-tucked" : ""}`}
      aria-label="Chat with us on Telegram"
    >
      <span className="telegram-fab-spin">
        <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle className="telegram-fab-disc" cx="120" cy="120" r="120" />
          <path
            className="telegram-fab-plane"
            d="M170 72l-20.5 100.8c-1.5 6.9-5.6 8.6-11.4 5.4l-31.5-23.2-15.2 14.6c-1.7 1.7-3.1 3.1-6.3 3.1l2.2-32 58.4-52.8c2.5-2.3-.6-3.5-3.9-1.3l-72.2 45.5-31.1-9.7c-6.8-2.1-6.9-6.8 1.4-10l121.6-46.9c5.6-2.1 10.6 1.4 8.5 10.5z"
          />
        </svg>
      </span>
      <span className="telegram-fab-tooltip">Chat 1:1 with our admin</span>
    </a>
  );
}
