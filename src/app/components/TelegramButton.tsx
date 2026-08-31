/**
 * A floating "chat with us" button, fixed to the viewport so it stays visible
 * on every page and the whole time the shopper scrolls — opens a 1:1 Telegram
 * chat with the shop's admin account in a new tab. Restyled in the brand's
 * rose palette (same gradient as the profile card / CTA banner) rather than
 * Telegram's own blue, so it reads as part of K-Glow rather than a generic
 * widget. Rendered once in App.tsx, outside the route Switch, so it survives
 * navigation instead of remounting (and restarting its spin animation) on
 * every page change.
 */
const ADMIN_TELEGRAM = "https://t.me/Zakaz_adminka1";

export function TelegramButton() {
  return (
    <a
      href={ADMIN_TELEGRAM}
      target="_blank"
      rel="noopener noreferrer"
      className="telegram-fab"
      aria-label="Chat with us on Telegram"
    >
      <span className="telegram-fab-spin">
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="telegramFabGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b85c7a" />
              <stop offset="70%" stopColor="#d687a1" />
              <stop offset="100%" stopColor="#ffb6c1" />
            </linearGradient>
          </defs>
          <circle cx="120" cy="120" r="120" fill="url(#telegramFabGrad)" />
          <path
            d="M170 72l-20.5 100.8c-1.5 6.9-5.6 8.6-11.4 5.4l-31.5-23.2-15.2 14.6c-1.7 1.7-3.1 3.1-6.3 3.1l2.2-32 58.4-52.8c2.5-2.3-.6-3.5-3.9-1.3l-72.2 45.5-31.1-9.7c-6.8-2.1-6.9-6.8 1.4-10l121.6-46.9c5.6-2.1 10.6 1.4 8.5 10.5z"
            fill="#fff"
          />
        </svg>
      </span>
      <span className="telegram-fab-tooltip">Chat 1:1 with our admin</span>
    </a>
  );
}
