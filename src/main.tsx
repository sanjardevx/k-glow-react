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
import { getAccessToken } from "./lib/authToken";

// Harmless against a normal backend — only matters when VITE_SERVER_API
// points at an ngrok tunnel, whose free tier otherwise serves an
// interstitial "visit site" warning page in place of the actual API
// response on every request.
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

// Every authenticated call carries the session as an Authorization header
// rather than relying on the cross-domain cookie the API also sets — see
// lib/authToken.ts for why that cookie cannot be trusted. Attached here, once,
// so no individual service has to remember to do it. Read fresh on each
// request instead of captured at boot, so a sign-in or sign-out mid-session
// takes effect immediately.
axios.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

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
