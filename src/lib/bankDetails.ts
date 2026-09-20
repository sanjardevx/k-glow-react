/**
 * The card shoppers transfer to — shown in full on the payment modal and, as
 * a plain reference, on the Orders page. One source of truth so the two can't
 * drift apart (they had: the Orders page carried a different, wrongly-masked
 * number that didn't match this one at all).
 *
 * HUMO is a card network, not a bank, and the card is in the owner's own name
 * rather than the shop's — so the labels read "Card" and "Card holder", which
 * is also what the shopper sees in their banking app when they send money.
 */
export const BANK_DETAILS = {
  card: "HUMO",
  cardHolder: "G’ofurjonova Zilola",
  cardNumber: "9860 1901 0585 8707",
};
