/**
 * MUI typography, mapped to the same faces and scale as src/css/tokens.css.
 * Only the MUI components we render (Tabs, Menu, Container) read this, but it
 * keeps them in step with the page CSS.
 */
const display = "'Playfair Display', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif";
const body = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export default {
  fontFamily: body,
  fontSize: 14,
  h1: {
    fontFamily: display,
    fontWeight: 500,
    fontSize: 40,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  },
  h2: {
    fontFamily: display,
    fontWeight: 500,
    fontSize: 32,
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
  },
  h3: {
    fontFamily: display,
    fontWeight: 500,
    fontSize: 24,
    lineHeight: 1.2,
    letterSpacing: "-0.015em",
  },
  h4: {
    fontFamily: body,
    fontWeight: 600,
    fontSize: 20,
    lineHeight: 1.25,
  },
  h5: {
    fontFamily: body,
    fontWeight: 600,
    fontSize: 16,
    lineHeight: 1.3,
  },
  h6: {
    fontFamily: body,
    fontWeight: 600,
    fontSize: 14,
    lineHeight: 1.35,
  },
  body1: {
    fontSize: 14,
    lineHeight: 1.6,
  },
  body2: {
    fontSize: 13,
    lineHeight: 1.55,
  },
  button: {
    fontWeight: 600,
    textTransform: "none" as const,
    letterSpacing: "0.01em",
  },
  overline: {
    fontWeight: 600,
    fontSize: 11,
    letterSpacing: "0.12em",
  },
};
