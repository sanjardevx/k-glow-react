/**
 * The shop's three languages: Uzbek, Russian and English.
 *
 * Every piece of interface copy lives in the dictionaries next to this file,
 * keyed the same in each — en.ts is the source of truth, and the other two
 * are typed against it, so a missing translation is a build error rather
 * than a blank on the page.
 *
 * Plain module state rather than a React provider, for the same reason as
 * lib/toast.ts: services and hooks phrase messages too. Components subscribe
 * through useI18n(), which re-renders them when the language changes.
 *
 * What the admin types — product names, descriptions, reviews — is not
 * translated; it shows as written.
 */
import { useSyncExternalStore } from "react";
import { en, type Dict } from "./en";
import { uz } from "./uz";
import { ru } from "./ru";

export type Lang = "uz" | "ru" | "en";
export type TKey = keyof Dict;

export const LANGUAGES: { code: Lang; short: string; name: string }[] = [
  { code: "uz", short: "UZ", name: "Oʻzbekcha" },
  { code: "ru", short: "RU", name: "Русский" },
  { code: "en", short: "EN", name: "English" },
];

const DICTS: Record<Lang, Dict> = { uz, ru, en };
const STORAGE_KEY = "lang";

/**
 * A choice the shopper made wins; otherwise the phone's own language when it
 * is one of ours. Anything else gets Uzbek — the language of most of the
 * shop's customers.
 */
function detect(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "uz" || saved === "ru" || saved === "en") return saved;
  } catch {
    // Storage blocked (private mode) — fall through to the browser's language.
  }
  for (const tag of navigator.languages ?? [navigator.language]) {
    const code = tag.toLowerCase().slice(0, 2);
    if (code === "uz" || code === "ru" || code === "en") return code;
  }
  return "uz";
}

let current: Lang = detect();
document.documentElement.lang = current;
const listeners = new Set<() => void>();

export function getLang(): Lang {
  return current;
}

export function setLang(lang: Lang) {
  if (lang === current) return;
  current = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Not remembered across visits, but still switched for this one.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** `t("cart.items", { count: 3 })` — `{name}` placeholders are filled in. */
export function t(key: TKey, vars?: Record<string, string | number>): string {
  const text = DICTS[current][key] ?? en[key];
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match,
  );
}

/**
 * The noun that goes with a number. Dictionary entries hold the forms split
 * by "|": English "product|products", Russian "товар|товара|товаров" (one,
 * few, many). Uzbek keeps the noun singular after a number, so it has one.
 */
export function plural(key: TKey, count: number): string {
  const forms = t(key).split("|");
  if (forms.length === 1) return forms[0];
  const rule = new Intl.PluralRules(current).select(count);
  const order = current === "ru" ? ["one", "few", "many"] : ["one", "other"];
  const index = order.indexOf(rule);
  return forms[index === -1 ? forms.length - 1 : index];
}

/** The locale dates are written in. */
export function dateLocale(): string {
  return current === "uz" ? "uz-UZ" : current === "ru" ? "ru-RU" : "en-GB";
}

/**
 * The API answers in English. The messages a shopper can actually meet are
 * looked up here by their exact wording (copied from the backend's
 * libs/Errors.ts); anything else is shown as the server sent it.
 */
const SERVER_MESSAGES: Record<string, TKey> = {
  "Something went wrong!": "error.generic",
  "No data found!": "error.noData",
  "Create failed!": "error.generic",
  "Update failed!": "error.updateFailed",
  "You are inserting already used nick or phone!": "error.usedNickPhone",
  "No member with that member nick": "error.noMember",
  "You have been blocked, contact the admin!": "error.blocked",
  "This account signs in with Google — use the Google button.":
    "error.googleAccount",
  "Google sign-in failed, please try again.": "error.googleFailed",
  "Google sign-in isn't set up yet.": "error.googleOff",
  "AI Beauty isn't set up yet.": "error.aiOff",
  "We couldn't build your routine just now, please try again.": "error.aiFailed",
  "We couldn't answer just now, please try again.": "error.aiChatFailed",
  "You've used today's 10 AI answers. Come back tomorrow!": "error.aiLimit",
  "Wrong password, please try again!": "error.wrongPassword",
  "You are not authenticated, please login first!": "error.loginFirst",
  "Too many attempts, please try again later!": "error.tooMany",
  "One of the products is no longer available!": "error.productUnavailable",
  "Sorry, there isn't enough stock left for one of the products!":
    "error.notEnoughStock",
  "Please upload an image (jpg, png, webp, avif or heic) under 10 MB!":
    "error.invalidImage",
  "Please check your input and try again!": "error.invalidInput",
  "Your name must be 2 to 30 characters!": "error.nickLength",
  "Please enter a valid phone number!": "error.invalidPhone",
  "Password must be 6 to 72 characters!": "error.passwordLength",
  "That text is too long, please shorten it!": "error.textTooLong",
  "Something is wrong with your basket, please refresh and try again!":
    "error.invalidOrderItems",
};

export function translateServerMessage(message: string): string {
  const key = SERVER_MESSAGES[message];
  return key ? t(key) : message;
}

/** For components: re-renders on a language change. */
export function useI18n() {
  const lang = useSyncExternalStore(subscribe, getLang);
  return { lang, setLang, t, plural };
}
