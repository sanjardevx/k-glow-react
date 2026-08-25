import { useState } from "react";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { CheckoutStepper } from "../../components/CheckoutStepper";
import { PaymentModal } from "../../components/PaymentModal";
import { isFreeDelivery } from "./cartSelectors";
import { useBasket } from "./useBasket";
import { formatPrice } from "../productsPage/productsData";
import { serverApi } from "../../../lib/config";
import "../../../css/cart.css";

export function CartPage() {
  const { items, count, subtotal, onIncrease, onDecrease, onDelete } =
    useBasket();
  const freeDelivery = isFreeDelivery(subtotal);
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <div className="cart-page">
      <CheckoutStepper currentStep={1} />
      <Box className="cart-body">
        <h2 className="cart-title">Your Bag</h2>

        {items.length === 0 ? (
          <Box className="cart-empty">
            Your bag is empty.{" "}
            <Link to="/products" className="cart-empty-link">
              Start shopping →
            </Link>
          </Box>
        ) : (
          <Box className="cart-layout">
            <Box className="cart-items">
              {items.map((item) => (
                <Box className="cart-item" key={item._id}>
                  <img
                    className="thumb"
                    src={`${serverApi}/${item.productImage}`}
                    alt={item.productName}
                  />
                  <Box className="info">
                    <span className="brand">{item.productBrand}</span>
                    <span className="name">{item.productName}</span>
                    <span className="unit">{formatPrice(item.price)} each</span>
                  </Box>
                  <Box className="qty-stepper">
                    <button type="button" onClick={() => onDecrease(item)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => onIncrease(item)}>
                      +
                    </button>
                  </Box>
                  <span className="line-total">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    className="remove"
                    aria-label={`Remove ${item.productName}`}
                    onClick={() => onDelete(item)}
                  >
                    ×
                  </button>
                </Box>
              ))}
            </Box>

            <Box className="summary-card">
              <h4>Order Summary</h4>
              <Box className="summary-row">
                <span>Subtotal ({count} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </Box>
              <Box className="summary-row">
                <span>Delivery</span>
                <span>
                  {freeDelivery ? "Free" : "Paid to courier on pickup"}
                </span>
              </Box>
              <Box className="summary-row total">
                <span>Total to pay now</span>
                <span>{formatPrice(subtotal)}</span>
              </Box>
              <button
                type="button"
                className="pay-btn"
                onClick={() => setPaymentOpen(true)}
              >
                Pay
              </button>
              {!freeDelivery ? (
                <p className="cart-note">
                  Free delivery on orders over 500,000 so'm. Below that, the
                  courier fee is paid on pickup — not included here.
                </p>
              ) : null}
            </Box>
          </Box>
        )}
      </Box>

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        items={items}
        subtotal={subtotal}
      />
    </div>
  );
}
