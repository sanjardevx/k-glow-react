import { NavLink, useHistory } from "react-router-dom";
import { useGlobals } from "../../context/useGlobals";
import { useAppDispatch } from "../../hooks";
import { clearCart } from "../../screens/cartPage/cartSlice";
import MemberService from "../../services/MemberService";
import { showError, showSuccess } from "../../../lib/toast";
import { useI18n } from "../../../lib/i18n";
import { LogoutIcon, UserIcon } from "../icons";

/** Signing out: forget the member, the token-backed session and the bag. */
function useLogout() {
  const { setAuthMember } = useGlobals();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { t } = useI18n();

  return async () => {
    try {
      const member = new MemberService();
      await member.logout();
      setAuthMember(null);
      // The bag belongs to whoever is signed in — a signed-out visitor isn't
      // allowed to have one (see useBasket.onAdd), so it can't survive logout
      // either. Without this, the old items and the "Pay" flow both stayed
      // reachable after signing out.
      dispatch(clearCart());
      // My Page, Orders, and Cart all mean nothing once signed out.
      if (
        history.location.pathname === "/member-page" ||
        history.location.pathname === "/orders" ||
        history.location.pathname === "/cart"
      )
        history.push("/");
      showSuccess(t("account.signedOut"));
    } catch (err) {
      console.log("Error, handleLogout:", err);
      showError(err);
    }
  };
}

/**
 * Logout straight from the header, rather than tucked inside a menu.
 */
export function LogoutButton() {
  const logout = useLogout();
  const { t } = useI18n();

  return (
    <button type="button" className="nav-tool nav-tool-logout" onClick={logout}>
      <LogoutIcon className="nav-tool-icon" />
      <span className="nav-tool-label">{t("account.logout")}</span>
    </button>
  );
}

/**
 * The signed-in shopper's way to My Page: a person icon over the words, the
 * way Coupang shows 마이쿠팡. It used to be the shopper's name opening a
 * small menu, and shoppers didn't think to open it. Orders are on My Page;
 * logout is LogoutButton beside this.
 */
export function AccountLink() {
  const { t } = useI18n();

  return (
    <NavLink to="/member-page" className="nav-tool" activeClassName="active">
      <UserIcon className="nav-tool-icon" />
      <span className="nav-tool-label">{t("account.myPage")}</span>
    </NavLink>
  );
}
