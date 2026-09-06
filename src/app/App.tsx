import { useEffect, useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
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
