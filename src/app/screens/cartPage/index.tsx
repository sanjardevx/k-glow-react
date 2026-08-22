import { useState } from "react";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { CheckoutStepper } from "../../components/CheckoutStepper";
import { PaymentModal } from "../../components/PaymentModal";
import {
  isFreeDelivery,
  useCartCount,
  useCartSubtotal,
  useResolvedCart,
} from "./cartSelectors";
import { useAppDispatch } from "../../hooks";
import { removeItem, setQuantity } from "./cartSlice";
import { finalPrice, formatPrice } from "../productsPage/productsData";
import "../../../css/cart.css";

export function CartPage() {
  const dispatch = useAppDispatch();
  const lines = useResolvedCart();
  const count = useCartCount();
  const subtotal = useCartSubtotal();
  const freeDelivery = isFreeDelivery(subtotal);
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <div className="cart-page">
      <CheckoutStepper currentStep={1} />
      <Box className="cart-body">
        <h2 className="cart-title">Your Bag</h2>

        {lines.length === 0 ? (
          <Box className="cart-empty">
            Your bag is empty.{" "}
            <Link to="/products" className="cart-empty-link">
              Start shopping →
            </Link>
          </Box>
        ) : (
          <Box className="cart-layout">
            <Box className="cart-items">
              {lines.map((line) => (
                <Box className="cart-item" key={line.productId}>
                  <img
                    className="thumb"
                    src={line.product.productImages[0]}
                    alt={line.product.productName}
                  />
                  <Box className="info">
                    <span className="brand">{line.product.productBrand}</span>
                    <span className="name">{line.product.productName}</span>
                    <span className="unit">
                      {formatPrice(finalPrice(line.product))} each
                    </span>
                  </Box>
                  <Box className="qty-stepper">
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          setQuantity({
                            productId: line.productId,
                            quantity: line.quantity - 1,
                          }),
                        )
                      }
                    >
                      −
                    </button>
                    <span>{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          setQuantity({
                            productId: line.productId,
                            quantity: line.quantity + 1,
                          }),
                        )
                      }
                    >
                      +
                    </button>
                  </Box>
                  <span className="line-total">
                    {formatPrice(line.lineTotal)}
                  </span>
                  <button
                    type="button"
                    className="remove"
                    aria-label={`Remove ${line.product.productName}`}
                    onClick={() => dispatch(removeItem(line.productId))}
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
        lines={lines}
        subtotal={subtotal}
      />
    </div>
  );
}
