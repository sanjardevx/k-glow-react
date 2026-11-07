import { useEffect, useState, type FormEvent } from "react";
import { Box } from "@mui/material";
import MemberService from "../../services/MemberService";
import { useGlobals } from "../../context/useGlobals";
import { useBodyScrollLock } from "../useBodyScrollLock";
import { onActivateKey } from "../a11y";
import { BusyLabel } from "../Loaders";
import { GoogleButton } from "./GoogleButton";
import { errorMessage, showSuccess } from "../../../lib/toast";
import { useI18n } from "../../../lib/i18n";
import "../../../css/auth.css";

export type AuthMode = "login" | "signup";

interface AuthenticationModalProps {
  open: boolean;
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
}

export function AuthenticationModal(props: AuthenticationModalProps) {
  const { open, mode, onClose, onSwitchMode } = props;
  const [memberNick, setMemberNick] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { setAuthMember } = useGlobals();
  const { t } = useI18n();

  useBodyScrollLock(open);

  // Never carry a half-typed password over into the next time it opens.
  useEffect(() => {
    if (open) return;
    setMemberNick("");
    setMemberPhone("");
    setMemberPassword("");
    setShowPassword(false);
    setError("");
    setSubmitting(false);
  }, [open]);

  // A message about the other form means nothing on this one.
  useEffect(() => setError(""), [mode]);

  const isSignup = mode === "signup";

  /** HANDLERS **/
  async function handleSignupRequest() {
    // Phone is optional on the server, but its unique index is sparse — two
    // members saved with an empty string would collide, so the form asks for
    // all three rather than sending a blank. There is no second password
    // box: the SHOW toggle lets the shopper check what they typed instead.
    if (!memberNick.trim() || !memberPhone.trim() || !memberPassword)
      throw new Error(t("error.fillAll"));

    const signupInput = { memberNick: memberNick.trim(), memberPhone, memberPassword };
    const authMember = await new MemberService().signup(signupInput);
    setAuthMember(authMember);
    onClose();
    showSuccess(t("auth.welcomeName", { name: signupInput.memberNick }));
  }

  async function handleLoginRequest() {
    if (!memberNick.trim() || !memberPassword) throw new Error(t("error.fillAll"));

    const loginInput = { memberNick: memberNick.trim(), memberPassword };
    const authMember = await new MemberService().login(loginInput);
    setAuthMember(authMember);
    onClose();
    showSuccess(t("auth.welcomeBack", { name: loginInput.memberNick }));
  }

  async function handleGoogleCredential(credential: string) {
    setError("");
    setSubmitting(true);
    try {
      const { member, isNew } = await new MemberService().googleAuth(credential);
      setAuthMember(member);
      onClose();
      showSuccess(
        t(isNew ? "auth.welcomeName" : "auth.welcomeBack", {
          name: member.memberNick,
        }),
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      if (isSignup) await handleSignupRequest();
      else await handleLoginRequest();
    } catch (err) {
      // Shown inside the form and the form left open: a missing field, a
      // taken name or a wrong password is fixed right here, and closing
      // would throw away everything they just typed.
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <Box className="modal-overlay auth-modal" onClick={onClose}>
      <Box className="modal-card" onClick={(e) => e.stopPropagation()}>
        <Box className="modal-head">
          <h4>{isSignup ? t("auth.create") : t("auth.welcome")}</h4>
          <span
            className="modal-close"
            onClick={onClose}
            role="button"
            tabIndex={0}
            aria-label={t("common.close")}
            onKeyDown={onActivateKey(onClose)}
          >
            ×
          </span>
        </Box>

        <GoogleButton mode={mode} onCredential={handleGoogleCredential} />

        <form onSubmit={handleSubmit} noValidate>
          <Box className="modal-field">
            {/* Login matches on the nickname only — the server never looks a
                member up by phone, so don't offer it as an option here. */}
            <label htmlFor="auth-nick">{t("auth.name")}</label>
            <input
              id="auth-nick"
              type="text"
              autoComplete={isSignup ? "nickname" : "username"}
              placeholder={t("auth.namePlaceholder")}
              value={memberNick}
              onChange={(e) => setMemberNick(e.target.value)}
              autoFocus
            />
          </Box>

          {isSignup ? (
            <Box className="modal-field">
              <label htmlFor="auth-phone">{t("auth.phone")}</label>
              <input
                id="auth-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+998 90 123 45 67"
                value={memberPhone}
                onChange={(e) => setMemberPhone(e.target.value)}
              />
            </Box>
          ) : null}

          <Box className="modal-field">
            <label htmlFor="auth-password">{t("auth.password")}</label>
            <Box className="pw-wrap">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                autoComplete={isSignup ? "new-password" : "current-password"}
                placeholder={isSignup ? t("auth.createPassword") : t("auth.yourPassword")}
                value={memberPassword}
                onChange={(e) => setMemberPassword(e.target.value)}
              />
              <span
                className="pw-toggle"
                role="button"
                tabIndex={0}
                aria-label={showPassword ? t("auth.hideAria") : t("auth.showAria")}
                onClick={() => setShowPassword((v) => !v)}
                onKeyDown={onActivateKey(() => setShowPassword((v) => !v))}
              >
                {showPassword ? t("auth.hide") : t("auth.show")}
              </span>
            </Box>
          </Box>

          {error ? (
            <p className="auth-error" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" className="modal-btn" disabled={submitting}>
            {submitting ? (
              <BusyLabel>{t("auth.wait")}</BusyLabel>
            ) : isSignup ? (
              t("auth.signup")
            ) : (
              t("auth.login")
            )}
          </button>
        </form>

        <p className="modal-switch">
          {isSignup ? t("auth.haveAccount") : t("auth.newHere")}{" "}
          <a
            onClick={() => onSwitchMode(isSignup ? "login" : "signup")}
            role="button"
            tabIndex={0}
            onKeyDown={onActivateKey(() =>
              onSwitchMode(isSignup ? "login" : "signup"),
            )}
          >
            {isSignup ? t("auth.login") : t("auth.createOne")}
          </a>
        </p>
      </Box>
    </Box>
  );
}
