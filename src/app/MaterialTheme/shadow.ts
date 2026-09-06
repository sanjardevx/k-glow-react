/**
 * MUI's 25-step elevation scale, tinted with the ink colour instead of neutral
 * black so Paper elevations read as part of the cream palette.
 * Mirrors --kg-shadow-* in src/css/tokens.css (the ink token as rgb 47, 30, 47).
 */
const ink = (alpha: number) => `rgba(47, 30, 47, ${alpha})`;

const shadows = [
  "none",
  `0 1px 2px ${ink(0.06)}`,
  `0 1px 3px ${ink(0.08)}`,
  `0 2px 4px -1px ${ink(0.1)}`,
  `0 3px 6px -2px ${ink(0.12)}`,
  `0 4px 8px -2px ${ink(0.12)}`,
  `0 5px 10px -3px ${ink(0.14)}`,
  `0 6px 12px -4px ${ink(0.14)}`,
  `0 8px 16px -6px ${ink(0.16)}`,
  `0 9px 18px -6px ${ink(0.16)}`,
  `0 10px 20px -8px ${ink(0.18)}`,
  `0 11px 22px -8px ${ink(0.18)}`,
  `0 12px 28px -14px ${ink(0.22)}`,
  `0 13px 28px -12px ${ink(0.22)}`,
  `0 14px 30px -12px ${ink(0.24)}`,
  `0 16px 32px -12px ${ink(0.24)}`,
  `0 18px 34px -14px ${ink(0.26)}`,
  `0 20px 36px -14px ${ink(0.26)}`,
  `0 20px 40px -16px ${ink(0.28)}`,
  `0 22px 42px -16px ${ink(0.28)}`,
  `0 24px 48px -20px ${ink(0.3)}`,
  `0 26px 50px -20px ${ink(0.3)}`,
  `0 28px 52px -22px ${ink(0.32)}`,
  `0 30px 54px -22px ${ink(0.32)}`,
  `0 32px 56px -24px ${ink(0.34)}`,
] as const;

export default shadows;
