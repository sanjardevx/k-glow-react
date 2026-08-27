import { Box, Stack } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import { formatPrice } from "../productsPage/productsData";
import { useAppSelector } from "../../hooks";
import { retrieveConfirmedOrders } from "./selector";
import { findOrderProduct } from "./orderHelpers";
import { serverApi } from "../../../lib/config";

export function ConfirmedOrders() {
  const orders = useAppSelector(retrieveConfirmedOrders);

  return (
    <TabPanel value="2">
      <Stack className="orders-list">
        {orders.length !== 0 ? (
          orders.map((order) => (
            <Box className="order-card" key={order._id}>
              <Box className="order-card-head">
                <span className="status-pill confirmed">Confirmed</span>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
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
              <Box className="order-total-row">
                <span>Delivery</span>
                <span>
                  {order.orderDelivery
                    ? formatPrice(order.orderDelivery)
                    : "Free"}
                </span>
              </Box>
              <Box className="order-total-row total">
                <span>Total</span>
                <span>{formatPrice(order.orderTotal)}</span>
              </Box>
              {order.deliveryAddress ? (
                <p className="order-note">
                  Delivery address: {order.deliveryAddress}
                </p>
              ) : null}
            </Box>
          ))
        ) : (
          <Box className="orders-empty">No confirmed orders yet.</Box>
        )}
      </Stack>
    </TabPanel>
  );
}
