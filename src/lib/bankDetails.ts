/**
 * The shop's own receiving bank account — shown in full on the payment modal
 * and, as a plain reference, on the Orders page. One source of truth so the
 * two can't drift apart (they had: the Orders page carried a different,
 * wrongly-masked number that didn't match this one at all).
 */
export const BANK_DETAILS = {
  bank: "Xalq Banki",
  accountName: "K-Glow Secrets",
  cardNumber: "8600 1234 5678 9012",
};
