import { useEffect, useRef, useState } from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import { useGlobals } from "./context/useGlobals";
import { useAppDispatch } from "./hooks";
import { clearCart } from "./screens/cartPage/cartSlice";
import { HomePage } from "./screens/homePage";
import { ProductsPage } from "./screens/productsPage";
import { CartPage } from "./screens/cartPage";
import { OrdersPage } from "./screens/ordersPage";
import { UserPage } from "./screens/userPage";
import { HelpPage } from "./screens/helpPage";
import { Footer } from "./components/footer";
import { HomeNavbar } from "./components/headers/HomeNavbar";
import { OtherNavbar } from "./components/headers/OtherNavbar";
import { AuthenticationModal, type AuthMode } from "./components/auth";
import { TelegramButton } from "./components/TelegramButton";
import { AnnouncementBar } from "./components/AnnouncementBar";
import "../css/app.css";

function App() {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { authMember, setAuthMember } = useGlobals();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  /**
   * A new route keeps the previous page's scroll position, so tapping a
   * product from halfway down the Shop grid would open its detail page already
   * scrolled past the photo. Keyed on the pathname only — the in-page "See
   * reviews" anchor changes the hash, and that jump should be left alone.
   */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  /**
   * The session lives in the `accessToken` cookie, which the browser drops the
   * moment it expires — but React state keeps showing the signed-in navbar and
   * the bag until a reload. Watch the cookie (and re-check on every tab focus,
   * since the session usually lapses while the tab is hidden); once it's gone,
   * tear things down exactly like an explicit logout: forget the member, drop
   * the saved copy, empty the bag a signed-out visitor may not keep, and leave
   * any account-only page.
   */
  const authRef = useRef(authMember);
  authRef.current = authMember;
  useEffect(() => {
    const cookies = new Cookies();
    function enforceSession() {
      if (!authRef.current || cookies.get("accessToken")) return;
      setAuthMember(null);
      localStorage.removeItem("memberData");
      dispatch(clearCart());
      const gated = ["/cart", "/orders", "/member-page"];
      if (gated.includes(history.location.pathname)) history.push("/");
    }
    const id = window.setInterval(enforceSession, 15000);
    window.addEventListener("focus", enforceSession);
    document.addEventListener("visibilitychange", enforceSession);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", enforceSession);
      document.removeEventListener("visibilitychange", enforceSession);
    };
  }, [dispatch, history, setAuthMember]);

  /** HANDLERS **/
  const handleAuthOpen = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };
  const handleAuthClose = () => setAuthOpen(false);

  return (
    <div className="app-shell">
      <AnnouncementBar />
      {location.pathname === "/" ? (
        <HomeNavbar onAuthOpen={handleAuthOpen} />
      ) : (
        <OtherNavbar onAuthOpen={handleAuthOpen} />
      )}
      <main className="app-main">
        <Switch>
          <Route path="/products" component={ProductsPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/orders" component={OrdersPage} />
          <Route path="/member-page" component={UserPage} />
          <Route path="/help" component={HelpPage} />
          <Route
            exact
            path="/"
            render={() => <HomePage onAuthOpen={handleAuthOpen} />}
          />
        </Switch>
      </main>
      <Footer />
      <TelegramButton />

      <AuthenticationModal
        open={authOpen}
        mode={authMode}
        onClose={handleAuthClose}
        onSwitchMode={setAuthMode}
      />
    </div>
  );
}

export default App;
