import { useState, type MouseEvent } from "react";
import { Box } from "@mui/material";
import Menu from "@mui/material/Menu";
import { NavLink, useHistory } from "react-router-dom";
import { useGlobals } from "../../context/useGlobals";
import { useAppDispatch } from "../../hooks";
import { clearCart } from "../../screens/cartPage/cartSlice";
import MemberService from "../../services/MemberService";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";

export function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { authMember, setAuthMember } = useGlobals();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    handleClose();
    try {
      const member = new MemberService();
      await member.logout();
      setAuthMember(null);
      // The bag belongs to whoever is signed in — a signed-out visitor isn't
      // allowed to have one (see useBasket.onAdd), so it can't survive logout
      // either. Without this, the old items and the "Pay" flow both stayed
      // reachable after signing out.
      dispatch(clearCart());
      // My Page and Cart are the two routes that mean nothing once signed out.
      if (
        history.location.pathname === "/member-page" ||
        history.location.pathname === "/cart"
      )
        history.push("/");
      await sweetTopSmallSuccessAlert("You're signed out.");
    } catch (err) {
      console.log("Error, handleLogout:", err);
      sweetErrorHandling(err).then();
    }
  };

  const memberNick = authMember?.memberNick ?? "";
  const initial = memberNick.charAt(0).toUpperCase();

  return (
    <>
      <Box
        className="nav-account"
        role="button"
        tabIndex={0}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <span className="nav-avatar">{initial}</span>
        <span className="nav-account-name">{memberNick}</span>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box className="account-menu-frame">
          <NavLink
            to="/member-page"
            className="account-menu-item"
            onClick={handleClose}
          >
            My Page
          </NavLink>
          <Box className="account-menu-divider" />
          <button
            type="button"
            className="account-menu-item account-menu-logout"
            onClick={handleLogout}
          >
            {/* Same mark the admin panel uses for logout, so the two halves of
                the product read as one system. */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </Box>
      </Menu>
    </>
  );
}
