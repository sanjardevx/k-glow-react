import type { Order, OrderItem } from "../../../lib/types/order";
import type { Product } from "../../../lib/types/product";

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
