/**
 * "Continue with Google", drawn by Google's own Identity Services script.
 *
 * Google renders the button (its branding rules require their artwork) and,
 * once the shopper picks an account, hands back a signed ID token. That token
 * goes to our API, which checks it with Google and signs the member in —
 * creating them on the first visit, so the one button is both sign-in and
 * sign-up.
 *
 * Renders nothing when VITE_GOOGLE_CLIENT_ID isn't set, so a deploy without
 * Google configured just shows the ordinary form.
 */
import { useEffect, useRef, useState } from "react";
import { GOOGLE_CLIENT_ID } from "../../../lib/config";
import { useI18n } from "../../../lib/i18n";

interface GoogleIdentity {
  accounts: {
    id: {
      initialize(options: {
        client_id: string;
        callback: (response: { credential: string }) => void;
        ux_mode?: "popup";
        cancel_on_tap_outside?: boolean;
      }): void;
      renderButton(
        parent: HTMLElement,
        options: Record<string, string | number>,
      ): void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";
let scriptPromise: Promise<GoogleIdentity> | null = null;

/** Loads Google's script once per visit, however often the modal opens. */
function loadGoogle(): Promise<GoogleIdentity> {
  scriptPromise ??= new Promise((resolve, reject) => {
    if (window.google) return resolve(window.google);
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () =>
      window.google ? resolve(window.google) : reject(new Error("no google"));
    script.onerror = () => {
      scriptPromise = null; // let the next open try again
      reject(new Error("Google sign-in could not load"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

interface GoogleButtonProps {
  mode: "login" | "signup";
  onCredential: (credential: string) => void;
}

export function GoogleButton({ mode, onCredential }: GoogleButtonProps) {
  const slotRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const { lang, t } = useI18n();
  // The latest handler, read when Google calls back — initialize() keeps the
  // first callback it was given for the life of the page.
  const onCredentialRef = useRef(onCredential);
  onCredentialRef.current = onCredential;

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;
    loadGoogle()
      .then((google) => {
        const slot = slotRef.current;
        if (cancelled || !slot) return;
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID!,
          callback: (response) => onCredentialRef.current(response.credential),
          ux_mode: "popup",
          cancel_on_tap_outside: true,
        });
        slot.replaceChildren();
        google.accounts.id.renderButton(slot, {
          type: "standard",
          theme: "outline",
          size: "large",
          shape: "pill",
          text: mode === "signup" ? "signup_with" : "continue_with",
          logo_alignment: "center",
          // Left alone, Google follows the browser's language, which need not
          // be the one the shopper picked here.
          locale: lang,
          // Google draws at a fixed pixel width, between 200 and 400.
          width: Math.min(400, Math.max(200, slot.offsetWidth)),
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [mode, lang]);

  if (!GOOGLE_CLIENT_ID || failed) return null;

  return (
    <>
      <div className="google-slot" ref={slotRef} />
      <div className="auth-divider" role="separator">
        <span>{t("auth.or")}</span>
      </div>
    </>
  );
}
