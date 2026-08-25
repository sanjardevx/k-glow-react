/**
 * A cart line is a snapshot, not a reference: the name, brand, price and image
 * are copied in at add-to-bag time. That keeps the basket renderable without a
 * catalog lookup — it no longer matters whether the Shop page has been visited
 * — and a price change mid-session can't silently rewrite what the shopper
 * thought they were buying.
 */
export interface CartItem {
  _id: string;
  quantity: number;
  productName: string;
  productBrand: string;
  /**
   * Stored exactly as the API returns it ("uploads/products/x.avif"); the host
   * prefix is added at render time so a saved cart survives the server moving.
   */
  productImage: string;
  /** What the customer pays per unit, discount already applied. */
  price: number;
}
