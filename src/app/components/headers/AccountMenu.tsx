import { useState, type MouseEvent } from "react";
import { Box } from "@mui/material";
import Menu from "@mui/material/Menu";
import { NavLink } from "react-router-dom";

export function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    // hardcoded for now — real logout wiring comes later
    handleClose();
  };

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
        <span className="nav-avatar">N</span>
        <span className="nav-account-name">Nodira</span>
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
            Log out
          </button>
        </Box>
      </Menu>
    </>
  );
}
