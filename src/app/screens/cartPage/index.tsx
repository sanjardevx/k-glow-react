import { useState } from "react";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { CheckoutStepper } from "../../components/CheckoutStepper";
import { PaymentModal } from "../../components/PaymentModal";
import { isFreeDelivery } from "./cartSelectors";
import { useBasket } from "./useBasket";
import { useGlobals } from "../../context/useGlobals";
import { formatPrice } from "../productsPage/productsData";
import { calculateOrderTotals } from "../../../lib/orderTotals";
import { serverApi } from "../../../lib/config";
import "../../../css/cart.css";

export function CartPage() {
  const { authMember, activeDiscount } = useGlobals();
  const { items, count, subtotal, onIncrease, onDecrease, onDelete } =
    useBasket();
  const totals = calculateOrderTotals(subtotal, activeDiscount.percent);
  // Measured on the subtotal, not on the discounted total: otherwise a
  // 520,000 bag slips under the threshold once the sale is applied and the
  // discount quietly costs the shopper a delivery fee.
  const freeDelivery = isFreeDelivery(subtotal);
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <div className="cart-page">
      <CheckoutStepper currentStep={1} />
      <Box className="cart-body">
        <h2 className="cart-title">Your Bag</h2>

        {!authMember ? (
          // Logging out clears the bag (see AccountMenu.handleLogout), so the
          // only way to land here signed out is a stale/expired session — the
          // bag and the Pay button must never be reachable without one.
          <Box className="cart-empty">
            Please log in to view your bag and check out.
          </Box>
        ) : items.length === 0 ? (
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
              {totals.discount > 0 ? (
                <Box className="summary-row discount">
                  <span>Discount ({totals.discountPercent}%)</span>
                  <span>&minus;{formatPrice(totals.discount)}</span>
                </Box>
              ) : null}
              <Box className="summary-row">
                <span>Delivery</span>
                <span>
                  {freeDelivery ? "Free" : "Paid to courier on pickup"}
                </span>
              </Box>
              <Box className="summary-row total">
                <span>Total to pay now</span>
                <span>{formatPrice(totals.total)}</span>
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
        amountDue={totals.total}
      />
    </div>
  );
}
