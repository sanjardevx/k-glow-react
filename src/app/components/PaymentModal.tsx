import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Box } from "@mui/material";
import { useHistory } from "react-router-dom";
import { CheckoutStepper } from "./CheckoutStepper";
import { formatPrice } from "../screens/productsPage/productsData";
import { type ResolvedCartLine } from "../screens/cartPage/cartSelectors";
import { useAppDispatch } from "../hooks";
import { clearCart } from "../screens/cartPage/cartSlice";
import "../../css/orders.css";
import "../../css/payment-modal.css";

type Step = "bank" | "confirm" | "thanks";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  lines: ResolvedCartLine[];
  subtotal: number;
}

export function PaymentModal({ open, onClose, lines, subtotal }: PaymentModalProps) {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [step, setStep] = useState<Step>("bank");
  const [screenshotName, setScreenshotName] = useState<string | null>(null);
  const [transferNote, setTransferNote] = useState("");

  // Snapshot the order at open time so the Thanks step still shows correct
  // totals after the cart is cleared on submit.
  const snapshotRef = useRef({ lines, subtotal, orderNo: "" });
  useEffect(() => {
    if (open) {
      snapshotRef.current = {
        lines,
        subtotal,
        orderNo: `KG-${Math.floor(10000 + Math.random() * 89999)}`,
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleClose() {
    setStep("bank");
    setScreenshotName(null);
    setTransferNote("");
    onClose();
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setScreenshotName(e.target.files?.[0]?.name ?? null);
  }

  function handleSubmitProof() {
    dispatch(clearCart());
    setStep("thanks");
  }

  function handleContinueShopping() {
    handleClose();
    history.push("/products");
  }

  if (!open) return null;

  const snap = snapshotRef.current;
  const itemCount = snap.lines.reduce((sum, l) => sum + l.quantity, 0);
  const currentStepNum = step === "bank" ? 2 : step === "confirm" ? 3 : 4;

  return (
    <Box className="modal-overlay" onClick={handleClose}>
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
                <Box className="bank-row">
                  <span>Card number</span>
                  <strong>8600 1234 5678 9012</strong>
                </Box>
                <Box className="bank-amount">
                  <span className="lbl">Amount to transfer</span>
                  <span className="amt">{formatPrice(snap.subtotal)}</span>
                </Box>
              </Box>
              <button
                type="button"
                className="modal-btn"
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
                <span className="ic">⬆</span>
                {screenshotName
                  ? `Selected: ${screenshotName}`
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
                disabled={!screenshotName}
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
              <p className="modal-subtext" style={{ textAlign: "center", marginTop: 12 }}>
                We'll verify your payment and confirm your order within a few
                hours.
              </p>
            </>
          )}
        </Box>
      ) : (
        <Box className="modal-card confirm-wrap" onClick={(e) => e.stopPropagation()}>
          <CheckoutStepper currentStep={4} compact />
          <Box className="confirm-check">✓</Box>
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
