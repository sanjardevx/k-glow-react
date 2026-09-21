/** The sale the shop is running right now, as the storefront sees it. */
export interface ActiveDiscount {
  /** 0 when no sale is on. Everything else keys off this. */
  percent: number;
  /** Optional name for the banner, e.g. "Autumn Sale". */
  label: string;
  /** Optional last day, "YYYY-MM-DD". Empty when the sale has no end date. */
  endsOn: string;
}

export const NO_DISCOUNT: ActiveDiscount = { percent: 0, label: "", endsOn: "" };
