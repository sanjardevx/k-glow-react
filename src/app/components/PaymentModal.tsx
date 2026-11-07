import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Box } from "@mui/material";
import { useHistory } from "react-router-dom";
import { CheckoutStepper } from "./CheckoutStepper";
import { formatPrice } from "../screens/productsPage/productsData";
import type { CartItem } from "../../lib/types/cart";
import { useBasket } from "../screens/cartPage/useBasket";
import { useGlobals } from "../context/useGlobals";
import { CheckIcon, UploadIcon } from "./icons";
import { useBodyScrollLock } from "./useBodyScrollLock";
import { onActivateKey } from "./a11y";
import { BankDetailsCard } from "./BankDetailsCard";
import { BusyLabel } from "./Loaders";
import OrderService from "../services/OrderService";
import { showError } from "../../lib/toast";
import { useI18n } from "../../lib/i18n";
import "../../css/orders.css";
import "../../css/payment-modal.css";

type Step = "bank" | "confirm" | "thanks";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  /** The bag after any sale — what the shopper types into their bank. */
  amountDue: number;
}

export function PaymentModal({ open, onClose, items, amountDue }: PaymentModalProps) {
  const { onDeleteAll } = useBasket();
  const { authMember } = useGlobals();
  const history = useHistory();
  const { t } = useI18n();
  const [step, setStep] = useState<Step>("bank");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [transferNote, setTransferNote] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState(
    authMember?.memberAddress ?? "",
  );
  const [submitting, setSubmitting] = useState(false);

  // Fixed when the modal opens, so the reference the shopper is reading does
  // not change under them while they pay.
  const orderNoRef = useRef("");
  useEffect(() => {
    if (open)
      orderNoRef.current = `KG-${Math.floor(10000 + Math.random() * 89999)}`;
  }, [open]);

  /**
   * Copied at submit, not at open. A copy is needed only because submitting
   * empties the bag while the Thanks step still has to show what was ordered.
   * Freezing at open showed — and would have collected — the undiscounted
   * total whenever the modal opened before the sale had finished loading.
   */
  const submittedRef = useRef<{ items: CartItem[]; amountDue: number } | null>(
    null,
  );

  // Freeze the page behind the modal so a scroll gesture that runs past the
  // modal's own scroll edge doesn't drag the cart page underneath.
  useBodyScrollLock(open);

  function handleClose() {
    submittedRef.current = null;
    setStep("bank");
    setScreenshot(null);
    setTransferNote("");
    setDeliveryAddress(authMember?.memberAddress ?? "");
    setSubmitting(false);
    onClose();
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setScreenshot(e.target.files?.[0] ?? null);
  }

  async function handleSubmitProof() {
    if (!screenshot || submitting) return;
    try {
      setSubmitting(true);
      const orderService = new OrderService();
      await orderService.createOrder(items, {
        paymentProof: [screenshot],
        transferNote,
        deliveryAddress,
      });

      // Copied before the bag is emptied: from here on the Thanks step is the
      // only thing that still knows what was ordered.
      submittedRef.current = { items, amountDue };

      // Only once the order is really on the server — otherwise the bag would
      // be thrown away for an order that never got created.
      onDeleteAll();
      setStep("thanks");
    } catch (err) {
      console.log("Error, handleSubmitProof:", err);
      showError(err);
    } finally {
      setSubmitting(false);
    }
  }

  function handleContinueShopping() {
    handleClose();
    history.push("/products");
  }

  // CartPage already keeps this closed for a signed-out visitor — this is
  // just the last line of defense (e.g. a session expiring mid-checkout).
  if (!open || !authMember) return null;

  // Live until the order is placed, frozen afterwards.
  const snap = {
    items: submittedRef.current?.items ?? items,
    amountDue: submittedRef.current?.amountDue ?? amountDue,
    orderNo: orderNoRef.current,
  };
  const itemCount = snap.items.reduce((sum, i) => sum + i.quantity, 0);
  const currentStepNum = step === "bank" ? 2 : step === "confirm" ? 3 : 4;

  return (
    <Box className="modal-overlay payment-modal" onClick={handleClose}>
      {step !== "thanks" ? (
        <Box className="modal-card" onClick={(e) => e.stopPropagation()}>
          <CheckoutStepper currentStep={currentStepNum} compact />

          {step === "bank" ? (
            <>
              <Box className="modal-head">
                <h4>{t("pay.title")}</h4>
                <span
                  className="modal-close"
                  onClick={handleClose}
                  role="button"
                  tabIndex={0}
                  aria-label={t("common.close")}
                  onKeyDown={onActivateKey(handleClose)}
                >
                  ×
                </span>
              </Box>
              <BankDetailsCard>
                <Box className="bank-amount">
                  <span className="lbl">{t("pay.amount")}</span>
                  <span className="amt">{formatPrice(snap.amountDue)}</span>
                </Box>
              </BankDetailsCard>

              <Box className="next-steps">
                <Box className="step">
                  <span className="n">1</span>
                  {t("pay.step1")}
                </Box>
                <Box className="step">
                  <span className="n">2</span>
                  {t("pay.step2")}
                </Box>
                <Box className="step">
                  <span className="n">3</span>
                  {t("pay.step3")}
                </Box>
              </Box>

              <Box className="modal-field">
                <label>{t("pay.address")}</label>
                <input
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder={t("pay.addressPlaceholder")}
                />
              </Box>
              <p className="modal-subtext tight">{t("pay.shipNote")}</p>

              <button
                type="button"
                className="modal-btn"
                disabled={!deliveryAddress.trim()}
                onClick={() => setStep("confirm")}
              >
                {t("pay.sent")}
              </button>
              <button type="button" className="modal-back" onClick={handleClose}>
                {t("pay.backToBag")}
              </button>
            </>
          ) : (
            <>
              <Box className="modal-head">
                <h4>{t("pay.confirmTitle")}</h4>
                <span
                  className="modal-close"
                  onClick={handleClose}
                  role="button"
                  tabIndex={0}
                  aria-label={t("common.close")}
                  onKeyDown={onActivateKey(handleClose)}
                >
                  ×
                </span>
              </Box>
              <label className="upload-box">
                <span className="ic">
                  <UploadIcon />
                </span>
                {screenshot
                  ? t("pay.selected", { name: screenshot.name })
                  : t("pay.upload")}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </label>
              <Box className="modal-field">
                <label>{t("pay.note")}</label>
                <input
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  placeholder={t("pay.notePlaceholder")}
                />
              </Box>
              <button
                type="button"
                className="modal-btn"
                disabled={!screenshot || submitting}
                onClick={handleSubmitProof}
              >
                {submitting ? (
                  <BusyLabel>{t("pay.sending")}</BusyLabel>
                ) : (
                  t("pay.submit")
                )}
              </button>
              <button
                type="button"
                className="modal-back"
                onClick={() => setStep("bank")}
              >
                {t("pay.prev")}
              </button>
              <p className="modal-subtext centered">{t("pay.verifyNote")}</p>
            </>
          )}
        </Box>
      ) : (
        <Box className="modal-card confirm-wrap" onClick={(e) => e.stopPropagation()}>
          <CheckoutStepper currentStep={4} compact />
          <Box className="confirm-check">
            <CheckIcon />
          </Box>
          <h3>{t("thanks.title")}</h3>
          <p>{t("thanks.text")}</p>
          <span className="status-pill wait">{t("status.waiting")}</span>
          <Box className="confirm-summary">
            <Box className="row">
              <span>{t("thanks.order")}</span>
              <span>#{snap.orderNo}</span>
            </Box>
            <Box className="row">
              <span>{t("thanks.items")}</span>
              <span>{itemCount}</span>
            </Box>
            <Box className="row total">
              <span>{t("common.total")}</span>
              <span>{formatPrice(snap.amountDue)}</span>
            </Box>
          </Box>
          <Box className="next-steps">
            <Box className="step">
              <span className="n">1</span>
              {t("thanks.step1")}
            </Box>
            <Box className="step">
              <span className="n">2</span>
              {t("thanks.step2")}
            </Box>
            <Box className="step">
              <span className="n">3</span>
              {t("thanks.step3")}
            </Box>
          </Box>
          <button
            type="button"
            className="confirm-cta"
            onClick={handleContinueShopping}
          >
            {t("thanks.continue")}
          </button>
        </Box>
      )}
    </Box>
  );
}
