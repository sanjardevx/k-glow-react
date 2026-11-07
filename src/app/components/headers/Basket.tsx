import { useState, type MouseEvent } from "react";
import { Box } from "@mui/material";
import Menu from "@mui/material/Menu";
import { useHistory } from "react-router-dom";
import { formatPrice } from "../../screens/productsPage/productsData";
import { useBasket } from "../../screens/cartPage/useBasket";
import { serverApi } from "../../../lib/config";
import { useI18n } from "../../../lib/i18n";
import { BagIcon } from "../icons";

export function Basket() {
  const history = useHistory();
  const { t } = useI18n();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { items, count, subtotal, onIncrease, onDecrease, onDelete, onDeleteAll } =
    useBasket();

  /** HANDLERS **/
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleStartShopping = () => {
    handleClose();
    history.push("/products");
  };
  const handleGoToCart = () => {
    handleClose();
    history.push("/cart");
  };

  return (
    <>
      <button
        type="button"
        className="nav-tool"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <span className="cart-wrap">
          <BagIcon className="nav-tool-icon" />
          {count > 0 ? <span className="cart-badge">{count}</span> : null}
        </span>
        <span className="nav-tool-label">{t("basket.aria")}</span>
      </button>
      <Menu
        anchorEl={anchorEl}
        id="basic-menu"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            // Colour, border and shadow come from the theme's MuiMenu
            // override; only the position and the little pointer live here.
            sx: {
              overflow: "visible",
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
                borderTop: "1px solid",
                borderLeft: "1px solid",
                borderColor: "divider",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {items.length === 0 ? (
          <Box className={"basket-frame"}>
            <Box className={"basket-empty"}>
              <Box className={"basket-empty-icon"}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                  <path d="M3 6h18"></path>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </Box>
              <p className={"basket-empty-title"}>{t("basket.emptyTitle")}</p>
              <p className={"basket-empty-text"}>
                {t("basket.emptyText")}
              </p>
              <button
                className={"basket-empty-cta"}
                onClick={handleStartShopping}
              >
                {t("basket.startShopping")}
              </button>
            </Box>
          </Box>
        ) : (
          <Box className={"basket-frame"}>
            <Box className={"basket-header"}>
              <span className={"basket-header-title"}>{t("basket.title")}</span>
              <button
                type="button"
                className={"basket-clear-all"}
                aria-label={t("basket.clearAll")}
                onClick={onDeleteAll}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18"></path>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                </svg>
              </button>
            </Box>
            <Box className={"basket-filled"}>
              {items.map((item) => (
                <Box className={"basket-line"} key={item._id}>
                  <img
                    src={`${serverApi}/${item.productImage}`}
                    className={"basket-line-thumb"}
                    alt={item.productName}
                  />
                  <Box className={"basket-line-info"}>
                    <Box className={"basket-line-top"}>
                      <span className={"basket-line-name"}>
                        {item.productName}
                      </span>
                      <button
                        type="button"
                        className={"basket-line-remove"}
                        aria-label={t("basket.remove", { name: item.productName })}
                        onClick={() => onDelete(item)}
                      >
                        ×
                      </button>
                    </Box>
                    <Box className={"basket-line-bottom"}>
                      <Box className={"basket-qty-stepper"}>
                        <button type="button" onClick={() => onDecrease(item)}>
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => onIncrease(item)}>
                          +
                        </button>
                      </Box>
                      <span className={"basket-line-price"}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </Box>
                  </Box>
                </Box>
              ))}
              <Box className={"basket-subtotal-row"}>
                <span>{t("basket.subtotal")}</span>
                <span>{formatPrice(subtotal)}</span>
              </Box>
              <button className={"basket-empty-cta"} onClick={handleGoToCart}>
                {t("basket.goToCart")}
              </button>
            </Box>
          </Box>
        )}
      </Menu>
    </>
  );
}
