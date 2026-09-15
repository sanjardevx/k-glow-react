// Global styles first: tokens → base → shared primitives. Every per-page
// stylesheet is imported by its component, so it lands later in the cascade
// and can override these with equal specificity.
import "./css/index.css";
import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./app/App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./app/MaterialTheme";
import { Router } from "./app/Router";
import { ContextProvider } from "./app/context/ContextProvider";

// Harmless against a normal backend — only matters when VITE_SERVER_API
// points at an ngrok tunnel, whose free tier otherwise serves an
// interstitial "visit site" warning page in place of the actual API
// response on every request.
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ContextProvider>
          <CssBaseline />
          <Router>
            <App />
          </Router>
        </ContextProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
