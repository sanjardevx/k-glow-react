import { useEffect, useState, type FormEvent } from "react";
import { Box } from "@mui/material";
import MemberService from "../../services/MemberService";
import { Messages } from "../../../lib/config";
import { useGlobals } from "../../context/useGlobals";
import { useBodyScrollLock } from "../useBodyScrollLock";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { setAuthMember } = useGlobals();

  useBodyScrollLock(open);

  // Never carry a half-typed password over into the next time it opens.
  useEffect(() => {
    if (open) return;
    setMemberNick("");
    setMemberPhone("");
    setMemberPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirm(false);
    setSubmitting(false);
  }, [open]);

  const isSignup = mode === "signup";

  /** HANDLERS **/
  async function handleSignupRequest() {
    try {
      // Phone is optional on the server, but its unique index is sparse — two
      // members saved with an empty string would collide, so the form asks for
      // all three rather than sending a blank.
      const isFullfill =
        memberNick !== "" &&
        memberPhone !== "" &&
        memberPassword !== "" &&
        confirmPassword !== "";
      if (!isFullfill) throw new Error(Messages.error3);
      if (memberPassword !== confirmPassword) throw new Error(Messages.error6);

      const signupInput = { memberNick, memberPhone, memberPassword };

      setSubmitting(true);
      const member = new MemberService();
      const authMember = await member.signup(signupInput);

      setAuthMember(authMember);
      onClose();
      await sweetTopSmallSuccessAlert(`Welcome, ${signupInput.memberNick}!`);
    } catch (err) {
      // Deliberately left open: a missing field or a taken nickname is
      // something the shopper fixes right here, and closing would throw away
      // everything they just typed.
      console.log("Error, handleSignupRequest:", err);
      sweetErrorHandling(err).then();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLoginRequest() {
    try {
      const isFullfill = memberNick !== "" && memberPassword !== "";
      if (!isFullfill) throw new Error(Messages.error3);

      const loginInput = { memberNick, memberPassword };

      setSubmitting(true);
      const member = new MemberService();
      const authMember = await member.login(loginInput);

      setAuthMember(authMember);
      onClose();
      await sweetTopSmallSuccessAlert(`Welcome back, ${loginInput.memberNick}!`);
    } catch (err) {
      // Same reasoning as signup: a wrong password is fixed in place.
      console.log("Error, handleLoginRequest:", err);
      sweetErrorHandling(err).then();
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (isSignup) handleSignupRequest().then();
    else handleLoginRequest().then();
  }

  if (!open) return null;

  return (
    <Box className="modal-overlay auth-modal" onClick={onClose}>
      <Box className="modal-card" onClick={(e) => e.stopPropagation()}>
        <Box className="modal-head">
          <h4>{isSignup ? "Create your account" : "Welcome back"}</h4>
          <span className="modal-close" onClick={onClose} role="button">
            ×
          </span>
        </Box>
        <p className="modal-subtext">
          {isSignup
            ? "Create an account to start shopping and place your orders."
            : "Log in to place your order and follow it through."}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignup ? (
            <Box className="modal-field">
              <label htmlFor="auth-nick">Name</label>
              <input
                id="auth-nick"
                type="text"
                autoComplete="nickname"
                placeholder="Enter your name"
                value={memberNick}
                onChange={(e) => setMemberNick(e.target.value)}
              />
            </Box>
          ) : null}

          <Box className="modal-field">
            {/* Login matches on the nickname only — the server never looks a
                member up by phone, so don't offer it as an option here. */}
            <label htmlFor="auth-phone">
              {isSignup ? "Phone number" : "Name"}
            </label>
            <input
              id="auth-phone"
              type="text"
              autoComplete={isSignup ? "tel" : "username"}
              placeholder={isSignup ? "+998 90 123 45 67" : "Enter your name"}
              value={isSignup ? memberPhone : memberNick}
              onChange={(e) =>
                isSignup
                  ? setMemberPhone(e.target.value)
                  : setMemberNick(e.target.value)
              }
            />
          </Box>

          <Box className="modal-field">
            <label htmlFor="auth-password">Password</label>
            <Box className="pw-wrap">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                autoComplete={isSignup ? "new-password" : "current-password"}
                placeholder={isSignup ? "Create a password" : "Enter your password"}
                value={memberPassword}
                onChange={(e) => setMemberPassword(e.target.value)}
              />
              <span
                className="pw-toggle"
                role="button"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </span>
            </Box>
          </Box>

          {isSignup ? (
            <Box className="modal-field">
              <label htmlFor="auth-password-confirm">Confirm password</label>
              <Box className="pw-wrap">
                <input
                  id="auth-password-confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="pw-toggle"
                  role="button"
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? "HIDE" : "SHOW"}
                </span>
              </Box>
            </Box>
          ) : null}

          {!isSignup ? <span className="forgot-link">Forgot password?</span> : null}

          <button type="submit" className="modal-btn" disabled={submitting}>
            {submitting ? "Please wait…" : isSignup ? "Sign up" : "Log in"}
          </button>
        </form>

        <p className="modal-switch">
          {isSignup ? "Already have an account? " : "New to K-Glow Secrets? "}
          <a
            onClick={() => onSwitchMode(isSignup ? "login" : "signup")}
            role="button"
          >
            {isSignup ? "Log in" : "Create one"}
          </a>
        </p>
      </Box>
    </Box>
  );
}
