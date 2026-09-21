import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import type { AuthMode } from "../../components/auth";
import { useGlobals } from "../../context/useGlobals";
import { useReveal } from "../../components/useReveal";

interface EventsProps {
  onAuthOpen: (mode: AuthMode) => void;
}

/**
 * "2026-10-31" -> { short: "31 October", full: "31 October 2026" }.
 *
 * Built from the parts rather than parsed: `new Date("2026-10-31")` is UTC
 * midnight and renders as the day before west of Greenwich. The shop only
 * ever means a calendar day here.
 */
function formatEndsOn(endsOn: string): { short: string; full: string } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(endsOn);
  if (!match) return { short: "", full: "" };

  const [, year, month, day] = match;
  const short = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  ).toLocaleDateString("en-GB", { day: "numeric", month: "long" });

  return { short, full: `${short} ${year}` };
}

/**
 * The campaign banner — the one block on the home page that asks for a
 * decision rather than showing product.
 *
 * What it offers comes from the server, so it can only ever advertise what
 * the checkout will actually apply. With no sale running it keeps its slot
 * and asks for the account a shopper will need when the next one starts.
 *
 * The button follows who is reading: a signed-out visitor cannot fill a bag
 * without an account, and for someone signed in "Sign Up" is a dead end.
 */
export function Events({ onAuthOpen }: EventsProps) {
  const revealRef = useReveal<HTMLElement>();
  const { authMember, activeDiscount } = useGlobals();

  const onSale = activeDiscount.percent > 0;
  const ends = formatEndsOn(activeDiscount.endsOn);

  const badge = onSale
    ? ends.short
      ? `Ends ${ends.short}`
      : activeDiscount.label || "Limited time"
    : "Coming soon";

  return (
    <section className="events reveal" ref={revealRef}>
      <Box className="cta-banner">
        <span className="deco d1" />
        <span className="deco d2" />
        <span className="deco d3" />
        {/* The badge carries the deadline, the headline carries the offer and
            the fine print carries the mechanics — each fact said once, rather
            than the percentage four times over. The copy is two beats: what
            is on offer, then the nudge to act on it. */}
        <span className="cta-badge">✨ {badge}</span>
        <Box component="h3">
          {onSale
            ? `Your Korean Beauty Shelf, ${activeDiscount.percent}% Off`
            : "Big Events & Sales Coming Soon"}
        </Box>
        <p className="cta-lead">
          Your favorite toners, serums, cleansers &amp; full sets — authentic,
          sealed, and sourced directly from Seoul.
        </p>
        <p>
          {onSale
            ? "That product you've been thinking about? This is your sign to finally make it yours."
            : "Create your account now so you're ready the moment the next sale starts."}
        </p>
        {authMember ? (
          <Link className="cta-signup-btn" to="/products">
            {onSale ? `Shop ${activeDiscount.percent}% Off ✨` : "Shop Now →"}
          </Link>
        ) : (
          <button
            type="button"
            className="cta-signup-btn"
            onClick={() => onAuthOpen("signup")}
          >
            {onSale ? `Shop ${activeDiscount.percent}% Off ✨` : "Sign Up ✨"}
          </button>
        )}
        <Box className="cta-perks">
          <span>🇰🇷 Sourced in Seoul</span>
          {/* Matches FREE_DELIVERY_THRESHOLD in cartPage/cartSelectors.ts and
              the announcement strip — all three quote the same figure. */}
          <span>🚚 Free delivery over 500,000 so'm</span>
          <span>🔒 Sealed and authentic</span>
        </Box>
        <p className="cta-fineprint">
          {onSale
            ? `${activeDiscount.percent}% is automatically applied at checkout — no promo code needed.${
                ends.full ? ` Offer ends ${ends.full}.` : ""
              }`
            : "We announce every sale on our Telegram channel first."}
        </p>
      </Box>
    </section>
  );
}
