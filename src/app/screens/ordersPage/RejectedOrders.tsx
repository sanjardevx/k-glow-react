import { Box, Stack } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import { ListSkeleton } from "../../components/Loaders";
import { formatPrice } from "../productsPage/productsData";
import { useAppSelector } from "../../hooks";
import { retrieveRejectedOrders } from "./selector";
import { findOrderProduct } from "./orderHelpers";
import { serverApi } from "../../../lib/config";
import { dateLocale, useI18n } from "../../../lib/i18n";

export function RejectedOrders({ loading }: { loading: boolean }) {
  const orders = useAppSelector(retrieveRejectedOrders);
  const { t } = useI18n();

  return (
    <TabPanel value="3">
      <Stack className="orders-list">
        {orders.length !== 0 ? (
          orders.map((order) => (
            <Box className="order-card" key={order._id}>
              <Box className="order-card-head">
                <span className="status-pill rejected">{t("status.rejected")}</span>
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
              {/* Shown straight on the card rather than behind a tap: being
                  told why is the whole point of opening this tab. Orders
                  rejected before the admin could leave a note fall back to
                  the old wording instead of an empty space. */}
              <p className="order-note reject-reason">
                {order.rejectReason ? (
                  <>
                    <strong>{t("orders.reason")}</strong> {order.rejectReason}
                  </>
                ) : (
                  t("orders.rejectedFallback")
                )}
              </p>
            </Box>
          ))
        ) : loading ? (
          <ListSkeleton rows={3} />
        ) : (
          <Box className="orders-empty">{t("orders.noRejected")}</Box>
        )}
      </Stack>
    </TabPanel>
  );
}
