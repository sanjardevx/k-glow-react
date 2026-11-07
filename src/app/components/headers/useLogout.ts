import { useHistory } from "react-router-dom";
import { useGlobals } from "../../context/useGlobals";
import { useAppDispatch } from "../../hooks";
import { clearCart } from "../../screens/cartPage/cartSlice";
import MemberService from "../../services/MemberService";
import { showError, showSuccess } from "../../../lib/toast";
import { useI18n } from "../../../lib/i18n";

/** Signing out: forget the member, the token-backed session and the bag. */
export function useLogout() {
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
