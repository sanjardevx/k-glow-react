import { Box } from "@mui/material";
import type { AuthMode } from "../../components/auth";
import { useReveal } from "../../components/useReveal";

interface EventsProps {
  onAuthOpen: (mode: AuthMode) => void;
}

export function Events({ onAuthOpen }: EventsProps) {
  const revealRef = useReveal<HTMLElement>();

  return (
    <section className="events reveal" ref={revealRef}>
      <Box className="cta-banner">
        <span className="deco d1" />
        <span className="deco d2" />
        <span className="deco d3" />
        <span className="cta-badge">🎁 Exclusive Offer</span>
        <Box component="h3">Get 10% Off Your First Order! ✨</Box>
        <p>
          Create your free K-Glow Secrets account and get 10% off your first
          order — no email lists, just a discount waiting for you.
        </p>
        <button
          type="button"
          className="cta-signup-btn"
          onClick={() => onAuthOpen("signup")}
        >
          Sign Up ✨
        </button>
        <Box className="cta-perks">
          <span>✉️ Weekly K-beauty tips</span>
          <span>✨ Exclusive product launches</span>
          <span>🎁 Special member discounts</span>
        </Box>
        <p className="cta-fineprint">
          Valid for first-time customers only, within 30 days of creating
          your account.
        </p>
      </Box>
    </section>
  );
}
