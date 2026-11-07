import { Box, Stack } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import { ListSkeleton } from "../../components/Loaders";
import { formatPrice } from "../productsPage/productsData";
import { useAppSelector } from "../../hooks";
import { retrieveWaitingOrders } from "./selector";
import { findOrderProduct } from "./orderHelpers";
import { serverApi } from "../../../lib/config";
import { dateLocale, useI18n } from "../../../lib/i18n";

export function WaitingOrders({ loading }: { loading: boolean }) {
  const orders = useAppSelector(retrieveWaitingOrders);
  const { t } = useI18n();

  return (
    <TabPanel value="1">
      <Stack className="orders-list">
        {orders.length !== 0 ? (
          orders.map((order) => (
            <Box className="order-card" key={order._id}>
              <Box className="order-card-head">
                <span className="status-pill wait">{t("status.waiting")}</span>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString(dateLocale())}
                </span>
              </Box>
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
                          {product?.productName ?? t("orders.unavailable")}
                        </span>
                        <span className="order-line-qty">
                          × {item.itemQuantity}
                        </span>
                      </Box>
                      <span className="order-line-price">
                        {/* The price the order was placed at, not today's. */}
                        {formatPrice(item.itemPrice * item.itemQuantity)}
                      </span>
                    </Box>
                  );
                })}
              </Box>
              <Box className="order-total-row">
                <span>{t("cart.delivery")}</span>
                <span>
                  {order.orderDelivery
                    ? formatPrice(order.orderDelivery)
                    : t("cart.free")}
                </span>
              </Box>
              {order.orderDiscount ? (
                <Box className="order-total-row discount">
                  <span>
                    {t("cart.discount", { percent: order.orderDiscountPercent ?? 0 })}
                  </span>
                  <span>&minus;{formatPrice(order.orderDiscount)}</span>
                </Box>
              ) : null}
              <Box className="order-total-row total">
                <span>{t("common.total")}</span>
                <span>{formatPrice(order.orderTotal)}</span>
              </Box>
              <p className="order-note">{t("orders.reviewing")}</p>
            </Box>
          ))
        ) : loading ? (
          <ListSkeleton rows={3} />
        ) : (
          <Box className="orders-empty">{t("orders.noWaiting")}</Box>
        )}
      </Stack>
    </TabPanel>
  );
}
