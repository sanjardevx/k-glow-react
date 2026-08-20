import { Box, Stack } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import { finalPrice, formatPrice, products } from "../productsPage/productsData";
import { ordersByStatus, orderTotal } from "./ordersData";

export function WaitingOrders() {
  const list = ordersByStatus("WAITING_CONFIRMATION");

  return (
    <TabPanel value="1">
      <Stack className="orders-list">
        {list.length !== 0 ? (
          list.map((order, index) => (
            <Box className="order-card" key={index}>
              <Box className="order-card-head">
                <span className="status-pill wait">Waiting Confirmation</span>
                <span className="order-date">{order.createdAt}</span>
              </Box>
              <Box className="order-items">
                {order.items.map((line, i) => {
                  const product = products[line.productId];
                  return (
                    <Box className="order-line" key={i}>
                      <img
                        src={product.productImages[0]}
                        className="order-line-thumb"
                        alt={product.productName}
                      />
                      <Box className="order-line-info">
                        <span className="order-line-name">
                          {product.productName}
                        </span>
                        <span className="order-line-qty">
                          × {line.itemQuantity}
                        </span>
                      </Box>
                      <span className="order-line-price">
                        {formatPrice(finalPrice(product) * line.itemQuantity)}
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
                <span>{formatPrice(orderTotal(order))}</span>
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
