import axios from "axios";
import { serverApi } from "../../lib/config";
import type { Product, ProductInquiry } from "../../lib/types/product";

class ProductService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getProducts(input: ProductInquiry): Promise<Product[]> {
    try {
      // As params, not pasted into the URL: a search for "a&b" or "#1" used to
      // cut the query short. axios encodes each value and drops unset ones.
      const result = await axios.get(`${this.path}/product/all`, {
        params: {
          order: input.order,
          page: input.page,
          limit: input.limit,
          productCategory: input.productCategory || undefined,
          search: input.search || undefined,
        },
      });
      return result.data;
    } catch (err) {
      console.log("Error, getProducts:", err);
      throw err;
    }
  }

  public async getCatalogStats(): Promise<{
    productCount: number;
    brandCount: number;
  }> {
    try {
      const result = await axios.get(`${this.path}/product/stats`);
      return result.data;
    } catch (err) {
      console.log("Error, getCatalogStats:", err);
      throw err;
    }
  }

  public async getProduct(productId: string): Promise<Product> {
    try {
      const url = `${this.path}/product/${productId}`;
      // withCredentials so the session cookie rides along — the backend only
      // counts a view (and de-duplicates it) for an identified member.
      const result = await axios.get(url, { withCredentials: true });
      return result.data;
    } catch (err) {
      console.log("Error, getProduct:", err);
      throw err;
    }
  }
}

export default ProductService;
