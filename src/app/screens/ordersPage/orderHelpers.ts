import type { Order, OrderItem } from "../../../lib/types/order";
import type { Product } from "../../../lib/types/product";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { t, type TKey } from "../../../lib/i18n";

/**
 * The API returns an order's items and the products they point at as two
 * separate arrays (one `$lookup` each), so a line is only renderable once the
 * two are matched back up by product id. Ids arrive as ObjectIds serialised to
 * strings, hence the String() on both sides.
 *
 * Returns undefined when the product has since been hard-deleted — the caller
 * still has the item's own price and quantity to show.
 */
export function findOrderProduct(
  order: Order,
  item: OrderItem,
): Product | undefined {
  return order.productData?.find(
    (product) => String(product._id) === String(item.productId),
  );
}

const STATUS_LABEL: Record<OrderStatus, TKey> = {
  [OrderStatus.WAITING_CONFIRMATION]: "status.waiting",
  [OrderStatus.CONFIRMED]: "status.confirmed",
  [OrderStatus.REJECTED]: "status.rejected",
};

const STATUS_PILL_CLASS: Record<OrderStatus, string> = {
  [OrderStatus.WAITING_CONFIRMATION]: "wait",
  [OrderStatus.CONFIRMED]: "confirmed",
  [OrderStatus.REJECTED]: "rejected",
};

/** Human label for a status, shared by every place that lists mixed-status orders. */
export function orderStatusLabel(status: OrderStatus): string {
  const key = STATUS_LABEL[status];
  return key ? t(key) : status;
}

/** `status-pill` modifier class for a status — matches orders.css's wait/confirmed/rejected. */
export function orderStatusPillClass(status: OrderStatus): string {
  return STATUS_PILL_CLASS[status] ?? "wait";
}
