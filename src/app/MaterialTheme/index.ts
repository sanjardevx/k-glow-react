import { createTheme } from "@mui/material/styles";
import shadows from "./shadow";
import typography from "./typography";

/**
 * MUI theme, mapped to the design tokens in src/css/tokens.css.
 *
 * Only a handful of MUI components are rendered (Menu, Tabs, IconButton,
 * Container, Box, Stack), so this theme's job is to make those match the
 * page CSS rather than to style the whole site. The palette values below are
 * the same literals as the tokens — MUI needs real colours to derive hover
 * and disabled states, so it cannot read `var(--kg-*)` here. Keep the two
 * files in step.
 */

const tokens = {
  bg: "#faf8f4",
  card: "#fefdfb",
  sand: "#f4eee7",
  border: "#e6dfd3",
  ink: "#2f1e2f",
  inkSoft: "#705c70",
  inkFaint: "#9c8b9c",
  primary: "#3e6f58",
  primaryHover: "#345d4a",
  primarySoft: "#e4f1eb",
  accentDeep: "#a34a33",
  warning: "#956318",
  danger: "#b12f2f",
} as const;

let theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: tokens.bg,
      paper: tokens.card,
    },
    primary: {
      main: tokens.primary,
      dark: tokens.primaryHover,
      light: tokens.primarySoft,
      contrastText: "#ffffff",
    },
    secondary: {
      main: tokens.sand,
      contrastText: tokens.ink,
    },
    success: {
      main: tokens.primary,
      contrastText: "#ffffff",
    },
    warning: {
      main: tokens.warning,
      contrastText: "#ffffff",
    },
    error: {
      main: tokens.danger,
      contrastText: "#ffffff",
    },
    info: {
      main: tokens.accentDeep,
      contrastText: "#ffffff",
    },
    text: {
      primary: tokens.ink,
      secondary: tokens.inkSoft,
      disabled: tokens.inkFaint,
    },
    divider: tokens.border,
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [...shadows],
  typography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { height: "100%" },
        body: {
          background: "var(--kg-bg)",
          color: "var(--kg-ink)",
          height: "100%",
          minHeight: "100%",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
          textTransform: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "var(--kg-card)",
          border: "1px solid var(--kg-border)",
          borderRadius: 16,
          boxShadow: "var(--kg-shadow-lg)",
        },
        list: {
          padding: 0,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "var(--kg-primary)",
          height: 2,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 44,
          fontWeight: 500,
          fontSize: 13.5,
          textTransform: "none",
          color: "var(--kg-ink-soft)",
          "&.Mui-selected": {
            color: "var(--kg-ink)",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "var(--kg-ink)",
          "&:hover": {
            backgroundColor: "var(--kg-sand)",
          },
        },
      },
    },
  },
});

// Container width lives here because it needs the breakpoint helper.
theme = createTheme(theme, {
  components: {
    MuiContainer: {
      styleOverrides: {
        maxWidthLg: {
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1300px",
          },
        },
      },
    },
  },
});

export default theme;
