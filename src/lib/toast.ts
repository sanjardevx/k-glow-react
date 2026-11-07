/**
 * Small toasts — one place to phrase every user-facing notice.
 *
 * Replaces SweetAlert2: every alert the shop shows is a one-line message that
 * goes away on its own, and a 78 kB dialog library was a heavy way to draw
 * that. Plain DOM rather than a React provider, so it can be called from
 * hooks and services as well as components, exactly as the old helpers were.
 */
import { t, translateServerMessage } from "./i18n";
import "../css/toast.css";

type Tone = "success" | "error";

const ICONS: Record<Tone, string> = {
  success:
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10.5l3.2 3.2L15 7" /></svg>',
  error:
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 6v5M10 14h.01" /></svg>',
};

let stack: HTMLElement | null = null;

function getStack(): HTMLElement {
  if (stack && document.body.contains(stack)) return stack;
  stack = document.createElement("div");
  stack.className = "kg-toast-stack";
  document.body.appendChild(stack);
  return stack;
}

function show(tone: Tone, message: string, duration: number) {
  const toast = document.createElement("div");
  toast.className = `kg-toast kg-toast--${tone}`;
  // Errors interrupt (the shopper has to act); successes wait their turn.
  toast.setAttribute("role", tone === "error" ? "alert" : "status");

  const icon = document.createElement("span");
  icon.className = "kg-toast-icon";
  icon.innerHTML = ICONS[tone];

  // textContent, never innerHTML: messages can carry server text.
  const text = document.createElement("span");
  text.className = "kg-toast-text";
  text.textContent = message;

  toast.append(icon, text);
  getStack().appendChild(toast);

  const dismiss = () => {
    toast.classList.add("is-leaving");
    // Removed on the transition's end, with a fallback for reduced motion,
    // where there is no transition to end.
    toast.addEventListener("transitionend", () => toast.remove(), {
      once: true,
    });
    setTimeout(() => toast.remove(), 400);
  };
  const timer = setTimeout(dismiss, duration);
  toast.addEventListener("click", () => {
    clearTimeout(timer);
    dismiss();
  });
}

/** Turns whatever was thrown — an axios error, an Error, a plain message —
 *  into the sentence the shopper should see. */
export function errorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  const e = err as { response?: { data?: { message?: string } }; message?: string };
  const message = e?.response?.data?.message ?? e?.message;
  return message ? translateServerMessage(message) : t("error.generic");
}

export function showError(err: unknown, duration: number = 4000) {
  show("error", errorMessage(err), duration);
}

export function showSuccess(message: string, duration: number = 2200) {
  show("success", message, duration);
}
