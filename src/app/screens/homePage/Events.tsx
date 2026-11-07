import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import type { AuthMode } from "../../components/auth";
import { useGlobals } from "../../context/useGlobals";
import { useReveal } from "../../components/useReveal";
import { dateLocale, useI18n } from "../../../lib/i18n";

interface EventsProps {
  onAuthOpen: (mode: AuthMode) => void;
}

/**
 * "2026-10-31" -> { short: "31 October", full: "31 October 2026" }, in the
 * current language's date format.
 *
 * Built from the parts rather than parsed: `new Date("2026-10-31")` is UTC
 * midnight and renders as the day before west of Greenwich. The shop only
 * ever means a calendar day here.
 */
function formatEndsOn(endsOn: string): { short: string; full: string } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(endsOn);
  if (!match) return { short: "", full: "" };

  const [, year, month, day] = match;
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  );
  return {
    short: date.toLocaleDateString(dateLocale(), { day: "numeric", month: "long" }),
    full: date.toLocaleDateString(dateLocale(), {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
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
  const { t } = useI18n();

  const onSale = activeDiscount.percent > 0;
  const ends = formatEndsOn(activeDiscount.endsOn);

  const percent = activeDiscount.percent;
  const badge = onSale
    ? ends.short
      ? t("events.ends", { date: ends.short })
      : activeDiscount.label || t("events.limited")
    : t("events.soon");

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
          {onSale ? t("events.saleTitle", { percent }) : t("events.soonTitle")}
        </Box>
        <p className="cta-lead">{t("events.lead")}</p>
        <p>{onSale ? t("events.saleNudge") : t("events.soonNudge")}</p>
        {authMember ? (
          <Link className="cta-signup-btn" to="/products">
            {onSale ? t("events.shopSale", { percent }) : t("events.shopNow")}
          </Link>
        ) : (
          <button
            type="button"
            className="cta-signup-btn"
            onClick={() => onAuthOpen("signup")}
          >
            {onSale ? t("events.shopSale", { percent }) : t("events.signup")}
          </button>
        )}
        <Box className="cta-perks">
          <span>{t("events.perkSeoul")}</span>
          {/* Matches FREE_DELIVERY_THRESHOLD in cartPage/cartSelectors.ts and
              the announcement strip — all three quote the same figure. */}
          <span>{t("events.perkDelivery")}</span>
          <span>{t("events.perkSealed")}</span>
        </Box>
        <p className="cta-fineprint">
          {onSale
            ? t("events.fineSale", { percent }) +
              (ends.full ? " " + t("events.fineEnds", { date: ends.full }) : "")
            : t("events.fineSoon")}
        </p>
      </Box>
    </section>
  );
}
