export const serverApi: string = import.meta.env.VITE_SERVER_API;

/** The OAuth client id from Google Cloud. Unset, the Google button hides. */
export const GOOGLE_CLIENT_ID: string | undefined =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || undefined;

/**
 * The admin's Telegram — the floating button and the footer's "Find us"
 * contact both point here, because a person reads and answers it.
 */
export const TELEGRAM_URL = "https://t.me/Zakaz_adminka1";

/**
 * The shop's broadcast channel — announcements only, nobody replies there.
 * Kept separate from TELEGRAM_URL so "message us" and "follow us" can't
 * quietly drift into pointing at the same place.
 */
export const TELEGRAM_CHANNEL_URL = "https://t.me/k_glow_secret";

