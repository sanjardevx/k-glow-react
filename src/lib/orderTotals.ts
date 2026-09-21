interface OrderTotals {
  subtotal: number;
  discountPercent: number;
  discount: number;
  total: number;
}

/**
 * What a basket costs once the running sale is applied.
 *
 * The discount comes off the subtotal once, not line by line: rounding per
 * line drifts — two lines of 123,255 lose 24,652 where the basket as a whole
 * loses 24,651 — and the shopper types this total into their bank by hand.
 * Rounding the discount rather than the total keeps
 * `subtotal - discount === total` exactly true, so the lines on screen add up.
 *
 * A copy of k-glow/src/libs/utils/orderTotals.ts, which is what the server
 * actually charges. The repos cannot share code, so change one, change both.
 *   (500000, 10) -> 50000 off, 450000     (246510, 10) -> 24651 off, 221859
 *   (100005, 10) -> 10001 off,  90004     (440000,  0) ->     0 off, 440000
 */
export function calculateOrderTotals(
  subtotal: number,
  discountPercent: number,
): OrderTotals {
  const percent =
    Number.isFinite(discountPercent) && discountPercent > 0
      ? Math.min(discountPercent, 100)
      : 0;
  const discount = Math.round((subtotal * percent) / 100);

  return { subtotal, discountPercent: percent, discount, total: subtotal - discount };
}
