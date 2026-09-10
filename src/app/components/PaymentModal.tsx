import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Box } from "@mui/material";
import { useHistory } from "react-router-dom";
import { CheckoutStepper } from "./CheckoutStepper";
import { formatPrice } from "../screens/productsPage/productsData";
import type { CartItem } from "../../lib/types/cart";
import { useBasket } from "../screens/cartPage/useBasket";
import { useGlobals } from "../context/useGlobals";
import { CheckIcon, CopyIcon, UploadIcon } from "./icons";
import { useBodyScrollLock } from "./useBodyScrollLock";
import OrderService from "../services/OrderService";
import { sweetErrorHandling } from "../../lib/sweetAlert";
import "../../css/orders.css";
import "../../css/payment-modal.css";

type Step = "bank" | "confirm" | "thanks";

const CARD_NUMBER = "8600 1234 5678 9012";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
}

export function PaymentModal({ open, onClose, items, subtotal }: PaymentModalProps) {
  const { onDeleteAll } = useBasket();
  const { authMember } = useGlobals();
  const history = useHistory();
  const [step, setStep] = useState<Step>("bank");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [transferNote, setTransferNote] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState(
    authMember?.memberAddress ?? "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopyCard() {
    const digits = CARD_NUMBER.replace(/\s/g, "");
    let ok = false;
    try {
      await navigator.clipboard.writeText(digits);
      ok = true;
    } catch {
      // Older or sandboxed contexts block the async Clipboard API — fall back
      // to the legacy path before giving up.
      try {
        const ta = document.createElement("textarea");
        ta.value = digits;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    // If both paths fail the number is still on screen to copy by hand.
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  }

  // Snapshot the order at open time so the Thanks step still shows correct
  // totals after the cart is cleared on submit.
  const snapshotRef = useRef({ items, subtotal, orderNo: "" });
  useEffect(() => {
    if (open) {
      snapshotRef.current = {
        items,
        subtotal,
        orderNo: `KG-${Math.floor(10000 + Math.random() * 89999)}`,
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Freeze the page behind the modal so a scroll gesture that runs past the
  // modal's own scroll edge doesn't drag the cart page underneath.
  useBodyScrollLock(open);

  function handleClose() {
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

      // Only once the order is really on the server — otherwise the bag would
      // be thrown away for an order that never got created.
      onDeleteAll();
      setStep("thanks");
    } catch (err) {
      console.log("Error, handleSubmitProof:", err);
      sweetErrorHandling(err).then();
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

  const snap = snapshotRef.current;
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
                <h4>Complete your payment</h4>
                <span className="modal-close" onClick={handleClose}>
                  ×
                </span>
              </Box>
              <Box className="bank-card">
                <Box className="bank-row">
                  <span>Bank</span>
                  <strong>Xalq Banki</strong>
                </Box>
                <Box className="bank-row">
                  <span>Account name</span>
                  <strong>K-Glow Secrets</strong>
                </Box>
                <Box className="bank-row bank-row-card">
                  <span>Card number</span>
                  <button
                    type="button"
                    className="bank-copy"
                    onClick={handleCopyCard}
                    aria-label={`Copy card number ${CARD_NUMBER}`}
                  >
                    <span className="bank-copy-num">{CARD_NUMBER}</span>
                    <span
                      className={`bank-copy-flag${copied ? " copied" : ""}`}
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                      {copied ? "Copied" : "Copy"}
                    </span>
                  </button>
                </Box>
                <Box className="bank-amount">
                  <span className="lbl">Amount to transfer</span>
                  <span className="amt">{formatPrice(snap.subtotal)}</span>
                </Box>
              </Box>

              <Box className="next-steps">
                <Box className="step">
                  <span className="n">1</span>Transfer the amount above to the
                  card shown.
                </Box>
                <Box className="step">
                  <span className="n">2</span>Save a screenshot or receipt of
                  the transfer — you'll upload it on the next step.
                </Box>
                <Box className="step">
                  <span className="n">3</span>Enter your delivery address
                  below, then continue.
                </Box>
              </Box>

              <Box className="modal-field">
                <label>Delivery address</label>
                <input
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Tashkent, Chilonzor tumani, 12-uy"
                />
              </Box>
              <p className="modal-subtext tight">
                We'll ship your order via BTS post to this address.
              </p>

              <button
                type="button"
                className="modal-btn"
                disabled={!deliveryAddress.trim()}
                onClick={() => setStep("confirm")}
              >
                I've sent the payment →
              </button>
              <button type="button" className="modal-back" onClick={handleClose}>
                ← Back to bag
              </button>
            </>
          ) : (
            <>
              <Box className="modal-head">
                <h4>Confirm your payment</h4>
                <span className="modal-close" onClick={handleClose}>
                  ×
                </span>
              </Box>
              <label className="upload-box">
                <span className="ic">
                  <UploadIcon />
                </span>
                {screenshot
                  ? `Selected: ${screenshot.name}`
                  : "Upload your transfer screenshot"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </label>
              <Box className="modal-field">
                <label>Transfer note / reference</label>
                <input
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  placeholder="e.g. transaction ID from your bank app"
                />
              </Box>
              <button
                type="button"
                className="modal-btn"
                disabled={!screenshot || submitting}
                onClick={handleSubmitProof}
              >
                Submit for confirmation
              </button>
              <button
                type="button"
                className="modal-back"
                onClick={() => setStep("bank")}
              >
                ← Previous step
              </button>
              <p className="modal-subtext centered">
                We'll verify your payment and confirm your order within a few
                hours.
              </p>
            </>
          )}
        </Box>
      ) : (
        <Box className="modal-card confirm-wrap" onClick={(e) => e.stopPropagation()}>
          <CheckoutStepper currentStep={4} compact />
          <Box className="confirm-check">
            <CheckIcon />
          </Box>
          <h3>Thanks! We're confirming your payment.</h3>
          <p>
            We've received your screenshot and transfer note — we'll verify
            it and confirm your order soon.
          </p>
          <span className="status-pill wait">Waiting Confirmation</span>
          <Box className="confirm-summary">
            <Box className="row">
              <span>Order</span>
              <span>#{snap.orderNo}</span>
            </Box>
            <Box className="row">
              <span>Items</span>
              <span>{itemCount}</span>
            </Box>
            <Box className="row total">
              <span>Total</span>
              <span>{formatPrice(snap.subtotal)}</span>
            </Box>
          </Box>
          <Box className="next-steps">
            <Box className="step">
              <span className="n">1</span>We check your payment screenshot
              against the amount.
            </Box>
            <Box className="step">
              <span className="n">2</span>We confirm your order and prepare
              it for shipping from Korea.
            </Box>
            <Box className="step">
              <span className="n">3</span>We contact you directly about
              delivery.
            </Box>
          </Box>
          <button
            type="button"
            className="confirm-cta"
            onClick={handleContinueShopping}
          >
            Continue shopping
          </button>
        </Box>
      )}
    </Box>
  );
}
