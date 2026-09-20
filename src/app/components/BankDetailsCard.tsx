import { useState, type ReactNode } from "react";
import { Box } from "@mui/material";
import { BANK_DETAILS } from "../../lib/bankDetails";
import { CheckIcon, CopyIcon } from "./icons";

interface BankDetailsCardProps {
  /** Modal-only extras, e.g. the "Amount to transfer" line. */
  children?: ReactNode;
}

/**
 * The card shoppers transfer to, with a working copy button on the number.
 * Used by the payment modal and, as a plain reference, by the Orders page —
 * one component so the two can never show different numbers again. It's the
 * shop's own receiving card, not the customer's, so showing it in full
 * (rather than masked) is fine, and is what actually makes the copy useful.
 */
export function BankDetailsCard({ children }: BankDetailsCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopyCard() {
    const digits = BANK_DETAILS.cardNumber.replace(/\s/g, "");
    let ok = false;
    try {
      await navigator.clipboard.writeText(digits);
      ok = true;
    } catch {
      // Older or sandboxed contexts block the async Clipboard API — fall back
      // to the legacy path before giving up.
      try {
        const ta = document.createElement("textarea");
        ta.value = digits;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    // If both paths fail the number is still on screen to copy by hand.
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  }

  return (
    <Box className="bank-card">
      <Box className="bank-row">
        <span>Card</span>
        <strong>{BANK_DETAILS.card}</strong>
      </Box>
      <Box className="bank-row">
        <span>Card holder</span>
        <strong>{BANK_DETAILS.cardHolder}</strong>
      </Box>
      <Box className="bank-row bank-row-card">
        <span>Card number</span>
        <button
          type="button"
          className="bank-copy"
          onClick={handleCopyCard}
          aria-label={`Copy card number ${BANK_DETAILS.cardNumber}`}
        >
          <span className="bank-copy-num">{BANK_DETAILS.cardNumber}</span>
          <span className={`bank-copy-flag${copied ? " copied" : ""}`}>
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      </Box>
      {children}
    </Box>
  );
}
