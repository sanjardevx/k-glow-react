import axios from "axios";
import { serverApi } from "../../lib/config";
import type { CartItem } from "../../lib/types/cart";
import type { Order, OrderInquiry } from "../../lib/types/order";

interface CreateOrderDetails {
  /** Transfer screenshots — the shop confirms the payment against these. */
  paymentProof: File[];
  transferNote?: string;
  deliveryAddress?: string;
}

class OrderService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async createOrder(
    items: CartItem[],
    details: CreateOrderDetails,
  ): Promise<Order> {
    try {
      const orderItems = items.map((item) => ({
        itemQuantity: item.quantity,
        itemPrice: item.price,
        productId: item._id,
      }));

      // Multipart rather than JSON: the order carries the transfer
      // screenshots, and multer reads the rest of the fields off the same
      // form — which is why `items` travels as a JSON string.
      const form = new FormData();
      form.append("items", JSON.stringify(orderItems));
      if (details.transferNote) form.append("transferNote", details.transferNote);
      if (details.deliveryAddress)
        form.append("deliveryAddress", details.deliveryAddress);
      details.paymentProof.forEach((file) => form.append("paymentProof", file));

      const url = this.path + "/order/create";
      const result = await axios.post(url, form, { withCredentials: true });

      return result.data;
    } catch (err) {
      console.log("Error, createOrder:", err);
      throw err;
    }
  }

  public async getMyOrders(input: OrderInquiry): Promise<Order[]> {
    try {
      const url = `${this.path}/order/all`;
      const query = `?page=${input.page}&limit=${input.limit}&orderStatus=${input.orderStatus}`;

      const result = await axios.get(url + query, { withCredentials: true });

      return result.data;
    } catch (err) {
      console.log("Error, getMyOrders:", err);
      throw err;
    }
  }
}

export default OrderService;
