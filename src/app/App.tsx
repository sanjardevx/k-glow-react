import { useEffect, useRef, useState } from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { useGlobals } from "./context/useGlobals";
import { useAppDispatch } from "./hooks";
import { clearCart } from "./screens/cartPage/cartSlice";
import MemberService from "./services/MemberService";
import { clearAccessToken } from "../lib/authToken";
import { HomePage } from "./screens/homePage";
import { ProductsPage } from "./screens/productsPage";
import { CartPage } from "./screens/cartPage";
import { OrdersPage } from "./screens/ordersPage";
import { UserPage } from "./screens/userPage";
import { HelpPage } from "./screens/helpPage";
import { TutorialsPage } from "./screens/tutorialsPage";
import { AiBeautyPage } from "./screens/aiBeautyPage";
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
   * The token expires on its own schedule, but React state keeps showing the
   * signed-in navbar and the bag until a reload. So ask the server (on a timer
   * and on every tab focus, since a session usually lapses while the tab is
   * hidden) instead of trying to work it out locally.
   *
   * Only an outright "not authenticated" tears anything down. A dropped
   * connection or a cold-starting API says nothing about whether the session
   * is still good, and signing someone out mid-checkout over a passing blip
   * is far worse than carrying a stale session to the next check — so those
   * are ignored and retried. When it really is gone, unwind exactly like an
   * explicit logout: forget the member, drop the stored token and its copy of
   * the member, empty the bag a signed-out visitor may not keep, and leave any
   * account-only page.
   */
  const authRef = useRef(authMember);
  authRef.current = authMember;
  useEffect(() => {
    async function enforceSession() {
      if (!authRef.current) return;
      try {
        if (await new MemberService().checkSession()) return;
      } catch {
        return; // server unreachable — assume nothing, check again later
      }
      setAuthMember(null);
      clearAccessToken();
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
          <Route path="/live-tutorials" component={TutorialsPage} />
          <Route path="/ai-beauty" component={AiBeautyPage} />
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
