export const serverApi: string = import.meta.env.VITE_SERVER_API;

/**
 * Copy for the announcement bar above the navbar. The delivery figure must
 * match FREE_DELIVERY_THRESHOLD in screens/cartPage/cartSelectors.ts — the
 * cart note quotes the same number.
 */
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

export const Announcement = {
  full: "Authentic K-beauty · Seoul → Tashkent · Free delivery over 500,000 so'm",
  short: "Free delivery over 500,000 so'm",
};

export const Messages = {
  error1: "Something went wrong!",
  error2: "Please login first!",
  error3: "Please fill in all the inputs!",
  error4: "Message is empty!",
  error5: "Only images with jpeg, jpg or png format are allowed!",
  error6: "The two passwords don't match!",
};
