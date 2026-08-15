import { createTheme } from "@mui/material/styles";
import { common } from "@mui/material/colors";
import shadow from "./shadow";
import typography from "./typography";

/**
 * LIGHT THEME (DEFAULT)
 */
const light = {
  palette: {
    type: "light",
    background: {
      default: "#FFFFFF",
      paper: common.white,
    },
    primary: {
      contrastText: "#FADADD",
      main: "#B85C7A",
    },
    secondary: {
      contrastText: "#B85C7A",
      main: "#FADADD",
    },
    text: {
      primary: "#2D1B2E",
      secondary: "#B85C7A",
      dark: common.black,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {},
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: { height: "100%" },
        body: { background: "#FFFFFF", height: "100%", minHeight: "100%" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
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
  },
  shadow,
  typography,
};

// A custom theme for this app
let theme = createTheme(light);
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
