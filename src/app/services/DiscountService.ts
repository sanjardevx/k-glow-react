import axios from "axios";
import { serverApi } from "../../lib/config";
import { NO_DISCOUNT, type ActiveDiscount } from "../../lib/types/discount";

class DiscountService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  /**
   * Never throws. This runs on every page load, and a shop that fails to
   * render because the sale could not be read is worse than a shop with no
   * banner — "no sale" is the safe answer, and it is also the honest one,
   * since a discount the server did not confirm is one the checkout would
   * not apply either.
   */
  public async getActiveDiscount(): Promise<ActiveDiscount> {
    try {
      const result = await axios.get(`${this.path}/discount/active`);

      return result.data ?? NO_DISCOUNT;
    } catch (err) {
      console.log("Error, getActiveDiscount:", err);
      return NO_DISCOUNT;
    }
  }
}

export default DiscountService;
