import { Fragment } from "react";
import { Box } from "@mui/material";
import { useI18n, type TKey } from "../../lib/i18n";
import "../../css/stepper.css";

const STEPS: TKey[] = ["step.bag", "step.payment", "step.confirm", "step.thanks"];

interface CheckoutStepperProps {
  currentStep: 1 | 2 | 3 | 4;
  compact?: boolean;
}

export function CheckoutStepper({ currentStep, compact }: CheckoutStepperProps) {
  const { t } = useI18n();
  return (
    <Box className={`stepper-wrap${compact ? " in-modal" : ""}`}>
      <Box className="stepper">
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const stateClass = isDone ? " done" : isCurrent ? " current" : "";
          return (
            <Fragment key={label}>
              <Box className={`step-node${stateClass}`}>
                <Box className="step-circle">{isDone ? "✓" : stepNum}</Box>
                <Box className="step-label">{t(label)}</Box>
              </Box>
              {i < STEPS.length - 1 ? (
                <Box
                  className={`step-line${stepNum < currentStep ? " filled" : ""}`}
                />
              ) : null}
            </Fragment>
          );
        })}
      </Box>
    </Box>
  );
}
