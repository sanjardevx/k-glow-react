import { useState, type MouseEvent } from "react";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import { useHistory } from "react-router-dom";
import { formatPrice } from "../../screens/productsPage/productsData";
import {
  useCartCount,
  useCartSubtotal,
  useResolvedCart,
} from "../../screens/cartPage/cartSelectors";
import { useAppDispatch } from "../../hooks";
import { clearCart, removeItem, setQuantity } from "../../screens/cartPage/cartSlice";

export function Basket() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const lines = useResolvedCart();
  const count = useCartCount();
  const subtotal = useCartSubtotal();

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
      <IconButton
        aria-label="cart"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <span className="cart-wrap">
          <svg
            className="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
            <path d="M3 6h18"></path>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span className="cart-badge">{count}</span>
        </span>
      </IconButton>
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
        {lines.length === 0 ? (
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
              <p className={"basket-empty-title"}>Your bag is empty</p>
              <p className={"basket-empty-text"}>
                Add your favorite K-beauty picks to get started.
              </p>
              <button
                className={"basket-empty-cta"}
                onClick={handleStartShopping}
              >
                Start Shopping
              </button>
            </Box>
          </Box>
        ) : (
          <Box className={"basket-frame"}>
            <Box className={"basket-header"}>
              <span className={"basket-header-title"}>Cart Products</span>
              <button
                type="button"
                className={"basket-clear-all"}
                aria-label="Clear all products"
                onClick={() => dispatch(clearCart())}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18"></path>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                </svg>
              </button>
            </Box>
            <Box className={"basket-filled"}>
              {lines.map((line) => (
                <Box className={"basket-line"} key={line.productId}>
                  <img
                    src={line.product.productImages[0]}
                    className={"basket-line-thumb"}
                    alt={line.product.productName}
                  />
                  <Box className={"basket-line-info"}>
                    <Box className={"basket-line-top"}>
                      <span className={"basket-line-name"}>
                        {line.product.productName}
                      </span>
                      <button
                        type="button"
                        className={"basket-line-remove"}
                        aria-label={`Remove ${line.product.productName}`}
                        onClick={() => dispatch(removeItem(line.productId))}
                      >
                        ×
                      </button>
                    </Box>
                    <Box className={"basket-line-bottom"}>
                      <Box className={"basket-qty-stepper"}>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              setQuantity({
                                productId: line.productId,
                                quantity: line.quantity - 1,
                              }),
                            )
                          }
                        >
                          −
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              setQuantity({
                                productId: line.productId,
                                quantity: line.quantity + 1,
                              }),
                            )
                          }
                        >
                          +
                        </button>
                      </Box>
                      <span className={"basket-line-price"}>
                        {formatPrice(line.lineTotal)}
                      </span>
                    </Box>
                  </Box>
                </Box>
              ))}
              <Box className={"basket-subtotal-row"}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </Box>
              <button className={"basket-empty-cta"} onClick={handleGoToCart}>
                Go to Cart
              </button>
            </Box>
          </Box>
        )}
      </Menu>
    </>
  );
}
