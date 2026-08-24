import type { OrderStatus } from "../enums/order.enum";
import type { Product } from "./product";
import type { Member } from "./member";

/** Mirrors the backend type (k-glow/src/libs/types/order.ts), minus mongoose-only fields. */
export interface OrderItem {
  _id: string;
  itemQuantity: number;
  itemPrice: number;
  orderId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: OrderStatus;
  deliveryAddress?: string;
  paymentProof?: string[];
  transferNote?: string;
  memberId: string;
  createdAt: string;
  updatedAt: string;
  //** from aggregation **//
  orderItems: OrderItem[];
  productData: Product[];
  memberData: Member[];
}

export interface OrderCreateInput {
  items: { productId: string; itemQuantity: number; itemPrice: number }[];
  deliveryAddress?: string;
  transferNote?: string;
  paymentProof?: string[];
}

export interface OrderInquiry {
  page: number;
  limit: number;
  orderStatus: OrderStatus;
}
