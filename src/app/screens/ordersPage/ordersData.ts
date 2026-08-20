import { finalPrice, products } from "../productsPage/productsData";

/** Mirrors the backend `OrderStatus` enum (k-glow/src/libs/enums/order.enum.ts). */
export type OrderStatus = "WAITING_CONFIRMATION" | "CONFIRMED" | "REJECTED";

export interface OrderLine {
  productId: number;
  itemQuantity: number;
}

/**
 * Shaped to match the backend Order model — orderTotal/orderDelivery are
 * pre-computed the same way OrderService.createOrder() does it, so wiring a
 * real API response in later is a drop-in change.
 */
export interface Order {
  orderStatus: OrderStatus;
  createdAt: string;
  deliveryAddress: string;
  items: OrderLine[];
  orderDelivery: number;
  rejectReason?: string;
}

function lineTotal(line: OrderLine): number {
  return finalPrice(products[line.productId]) * line.itemQuantity;
}

export function orderTotal(order: Order): number {
  const itemsTotal = order.items.reduce(
    (sum, line) => sum + lineTotal(line),
    0,
  );
  return itemsTotal + order.orderDelivery;
}

export const orders: Order[] = [
  {
    orderStatus: "WAITING_CONFIRMATION",
    createdAt: "2026-08-17",
    deliveryAddress: "Chilonzor, Tashkent",
    orderDelivery: 0,
    items: [
      { productId: 0, itemQuantity: 1 },
      { productId: 3, itemQuantity: 2 },
    ],
  },
  {
    orderStatus: "WAITING_CONFIRMATION",
    createdAt: "2026-08-18",
    deliveryAddress: "Yunusobod, Tashkent",
    orderDelivery: 15000,
    items: [{ productId: 6, itemQuantity: 1 }],
  },
  {
    orderStatus: "CONFIRMED",
    createdAt: "2026-08-10",
    deliveryAddress: "Chilonzor, Tashkent",
    orderDelivery: 0,
    items: [
      { productId: 1, itemQuantity: 1 },
      { productId: 2, itemQuantity: 1 },
    ],
  },
  {
    orderStatus: "CONFIRMED",
    createdAt: "2026-08-05",
    deliveryAddress: "Mirzo Ulug'bek, Tashkent",
    orderDelivery: 15000,
    items: [{ productId: 4, itemQuantity: 1 }],
  },
  {
    orderStatus: "REJECTED",
    createdAt: "2026-08-12",
    deliveryAddress: "Chilonzor, Tashkent",
    orderDelivery: 15000,
    rejectReason: "Transfer screenshot didn't match the order amount.",
    items: [{ productId: 9, itemQuantity: 1 }],
  },
];

export function ordersByStatus(status: OrderStatus): Order[] {
  return orders.filter((o) => o.orderStatus === status);
}
