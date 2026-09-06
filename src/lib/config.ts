export const serverApi: string = import.meta.env.VITE_SERVER_API;

/**
 * Copy for the announcement bar above the navbar. The delivery figure must
 * match FREE_DELIVERY_THRESHOLD in screens/cartPage/cartSelectors.ts — the
 * cart note quotes the same number.
 */
/** The shop's Telegram — used by the floating button and the footer link. */
export const TELEGRAM_URL = "https://t.me/Zakaz_adminka1";

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
