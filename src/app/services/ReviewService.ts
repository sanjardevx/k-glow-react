import axios from "axios";
import { serverApi } from "../../lib/config";
import type { Review } from "../../lib/types/review";

class ReviewService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  /** Cross-product feed for the Home page "Customer Love" section. */
  public async getReviews(limit: number): Promise<Review[]> {
    try {
      const url = `${this.path}/review/all?limit=${limit}`;
      const result = await axios.get(url);
      return result.data;
    } catch (err) {
      console.log("Error, getReviews:", err);
      throw err;
    }
  }

  /** Reviews for a single product's detail page. */
  public async getProductReviews(productId: string): Promise<Review[]> {
    try {
      const url = `${this.path}/review/product/${productId}`;
      const result = await axios.get(url);
      return result.data;
    } catch (err) {
      console.log("Error, getProductReviews:", err);
      throw err;
    }
  }
}

export default ReviewService;
