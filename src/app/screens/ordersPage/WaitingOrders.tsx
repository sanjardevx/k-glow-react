import { Box, Stack } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import { formatPrice } from "../productsPage/productsData";
import { useAppSelector } from "../../hooks";
import { retrieveWaitingOrders } from "./selector";
import { findOrderProduct } from "./orderHelpers";
import { serverApi } from "../../../lib/config";

export function WaitingOrders() {
  const orders = useAppSelector(retrieveWaitingOrders);

  return (
    <TabPanel value="1">
      <Stack className="orders-list">
        {orders.length !== 0 ? (
          orders.map((order) => (
            <Box className="order-card" key={order._id}>
              <Box className="order-card-head">
                <span className="status-pill wait">Waiting Confirmation</span>
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
                        {/* The price the order was placed at, not today's. */}
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
              <p className="order-note">
                We're reviewing your payment screenshot — this usually takes
                a few hours.
              </p>
            </Box>
          ))
        ) : (
          <Box className="orders-empty">No orders waiting confirmation.</Box>
        )}
      </Stack>
    </TabPanel>
  );
}
