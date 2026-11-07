import { NavLink } from "react-router-dom";
import { useI18n } from "../../../lib/i18n";
import { useLogout } from "./useLogout";
import { LogoutIcon, UserIcon } from "../icons";

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
