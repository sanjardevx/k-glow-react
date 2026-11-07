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
import { useI18n } from "../../../lib/i18n";
import "../../../css/cart.css";

export function CartPage() {
  const { authMember, activeDiscount } = useGlobals();
  const { t, plural } = useI18n();
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
        <h2 className="cart-title">{t("cart.title")}</h2>

        {!authMember ? (
          // Logging out clears the bag (see useLogout in AccountLink.tsx), so the
          // only way to land here signed out is a stale/expired session — the
          // bag and the Pay button must never be reachable without one.
          <Box className="cart-empty">{t("cart.loginFirst")}</Box>
        ) : items.length === 0 ? (
          <Box className="cart-empty">
            {t("cart.empty")}{" "}
            <Link to="/products" className="cart-empty-link">
              {t("cart.startShopping")}
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
                    <span className="unit">
                      {t("cart.each", { price: formatPrice(item.price) })}
                    </span>
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
                    aria-label={t("basket.remove", { name: item.productName })}
                    onClick={() => onDelete(item)}
                  >
                    ×
                  </button>
                </Box>
              ))}
            </Box>

            <Box className="summary-card">
              <h4>{t("cart.summary")}</h4>
              <Box className="summary-row">
                <span>
                  {t("cart.subtotal", {
                    count,
                    noun: plural("common.itemNoun", count),
                  })}
                </span>
                <span>{formatPrice(subtotal)}</span>
              </Box>
              {totals.discount > 0 ? (
                <Box className="summary-row discount">
                  <span>
                    {t("cart.discount", { percent: totals.discountPercent })}
                  </span>
                  <span>&minus;{formatPrice(totals.discount)}</span>
                </Box>
              ) : null}
              <Box className="summary-row">
                <span>{t("cart.delivery")}</span>
                <span>
                  {freeDelivery ? t("cart.free") : t("cart.payOnPickup")}
                </span>
              </Box>
              <Box className="summary-row total">
                <span>{t("cart.totalNow")}</span>
                <span>{formatPrice(totals.total)}</span>
              </Box>
              <button
                type="button"
                className="pay-btn"
                onClick={() => setPaymentOpen(true)}
              >
                {t("cart.pay")}
              </button>
              {!freeDelivery ? (
                <p className="cart-note">{t("cart.note")}</p>
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
