import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { formatPrice } from "../productsPage/productsData";
import {
  findOrderProduct,
  orderStatusLabel,
  orderStatusPillClass,
} from "../ordersPage/orderHelpers";
import { ChevronDownIcon } from "../../components/icons";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../context/useGlobals";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { serverApi } from "../../../lib/config";
import type { Order } from "../../../lib/types/order";

const RECENT_COUNT = 5;
const FETCH_LIMIT = 20;

/**
 * A compact, all-statuses preview of the shopper's own orders, one
 * accordion row per order (same interaction as the Help page's FAQ) —
 * collapsed shows status/date/total, expanding reveals the order's items.
 * The full tabbed Waiting/Confirmed/Rejected browsing experience still
 * lives at /orders ("View all" links there). Re-fetches fresh from the
 * server on every visit, so a status the admin just confirmed shows
 * correctly the next time this page loads — there's no live push, just
 * always-current data on load.
 */
export function OrderHistory() {
  const { authMember } = useGlobals();
  const [orders, setOrders] = useState<Order[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  // The open panel's height is measured from its content, so any number of
  // order items expands fully instead of hitting a fixed max-height cap.
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [openHeight, setOpenHeight] = useState(0);

  useEffect(() => {
    if (!openId) return;
    const panel = panelRefs.current[openId];
    if (panel) setOpenHeight(panel.scrollHeight);
  }, [openId, orders]);

  useEffect(() => {
    if (!authMember) return;

    const orderService = new OrderService();
    const page = { page: 1, limit: FETCH_LIMIT };

    Promise.all([
      orderService.getMyOrders({
        ...page,
        orderStatus: OrderStatus.WAITING_CONFIRMATION,
      }),
      orderService.getMyOrders({ ...page, orderStatus: OrderStatus.CONFIRMED }),
      orderService.getMyOrders({ ...page, orderStatus: OrderStatus.REJECTED }),
    ])
      .then(([waiting, confirmed, rejected]) => {
        const all = [...waiting, ...confirmed, ...rejected].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setOrders(all);
      })
      .catch((err) => console.log(err));
  }, [authMember]);

  const recent = orders.slice(0, RECENT_COUNT);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <Box className="settings-card orders-summary">
      <h4>Order history</h4>
      <p className="sub">Tap an order to see what's inside.</p>

      {recent.length === 0 ? (
        <p className="order-history-empty">
          You haven't placed an order yet.
        </p>
      ) : (
        recent.map((order) => {
          const open = openId === order._id;
          return (
            <Box className={`acc-item${open ? " open" : ""}`} key={order._id}>
              <button
                type="button"
                className="acc-head"
                onClick={() => toggle(order._id)}
              >
                <Box className="acc-head-left">
                  <span
                    className={`status-pill ${orderStatusPillClass(order.orderStatus)}`}
                  >
                    {orderStatusLabel(order.orderStatus)}
                  </span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </Box>
                <Box className="acc-head-right">
                  <strong>{formatPrice(order.orderTotal)}</strong>
                  <span className="acc-chevron">
                    <ChevronDownIcon />
                  </span>
                </Box>
              </button>
              <Box
                className="acc-body"
                style={{ maxHeight: open ? openHeight : 0 }}
              >
                <Box
                  className="acc-body-inner"
                  ref={(el: HTMLDivElement | null) => {
                    panelRefs.current[order._id] = el;
                  }}
                >
                  <Box className="order-items">
                    {order.orderItems?.map((item) => {
                      const product = findOrderProduct(order, item);
                      return (
                        <Box className="order-line" key={item._id}>
                          <img
                            src={`${serverApi}/${product?.productImages?.[0] ?? ""}`}
                            className="order-line-thumb"
                            alt={product?.productName ?? ""}
                          />
                          <Box className="order-line-info">
                            <span className="order-line-name">
                              {product?.productName ?? "Product unavailable"}
                            </span>
                            <span className="order-line-qty">
                              × {item.itemQuantity}
                            </span>
                          </Box>
                          <span className="order-line-price">
                            {formatPrice(item.itemPrice * item.itemQuantity)}
                          </span>
                        </Box>
                      );
                    })}
                  </Box>
                  {order.orderDiscount ? (
                    <Box className="order-total-row discount">
                      <span>Discount ({order.orderDiscountPercent}%)</span>
                      <span>&minus;{formatPrice(order.orderDiscount)}</span>
                    </Box>
                  ) : null}
                  <Box className="order-total-row total">
                    <span>Total</span>
                    <span>{formatPrice(order.orderTotal)}</span>
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })
      )}

      <Link to="/orders" className="see-all-link">
        View all orders →
      </Link>
    </Box>
  );
}
