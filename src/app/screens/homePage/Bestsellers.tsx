import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { finalPrice, formatPrice } from "../productsPage/productsData";
import { useAppSelector } from "../../hooks";
import { useBasket } from "../cartPage/useBasket";
import { useReveal } from "../../components/useReveal";
import { onActivateKey } from "../../components/a11y";
import { retrieveBestsellers } from "./selector";
import { serverApi } from "../../../lib/config";
import { ProductCardSkeletons } from "../../components/Loaders";

export function Bestsellers({ loading }: { loading: boolean }) {
  const { onAdd } = useBasket();
  const bestsellers = useAppSelector(retrieveBestsellers);
  const revealRef = useReveal<HTMLElement>();

  return (
    <section className="section reveal" ref={revealRef}>
      <Box className="section-inner">
        <Box className="section-head">
          <Box className="section-heading">
            <span className="eyebrow">Loved by our community</span>
            <Box className="section-title">
              Best<em>sellers</em>
            </Box>
          </Box>
          <Link
            to={{ pathname: "/products", search: "?category=bestseller" }}
            className="section-link"
          >
            View all →
          </Link>
        </Box>
        <Box className="product-grid product-grid-6">
          {loading && bestsellers.length === 0 ? (
            <ProductCardSkeletons count={10} />
          ) : null}
          {bestsellers.map((ele) => {
            const soldOut = ele.productStatus === "PAUSE";
            return (
              <Link
                to={`/products/${ele._id}`}
                className="p-card-link"
                key={ele._id}
              >
                <Box className={`p-card${soldOut ? " soldout" : ""}`}>
                  <Box className="p-photo">
                    {soldOut ? (
                      <span className="p-badge soldout">SOLD OUT</span>
                    ) : (
                      <span className="p-badge top">TOP</span>
                    )}
                    <Box className="p-photo-frame">
                      <img
                        src={`${serverApi}/${ele.productImages[0]}`}
                        alt={ele.productName}
                      />
                    </Box>
                  </Box>
                  <Box className="p-body">
                    <Box className="p-brand">{ele.productBrand}</Box>
                    <Box className="p-name">{ele.productName}</Box>
                    <Box className="p-price-row">
                      <span className="p-price">
                        {formatPrice(finalPrice(ele))}
                      </span>
                      {ele.productDiscount ? (
                        <span className="p-price-old">
                          {formatPrice(ele.productPrice)}
                        </span>
                      ) : null}
                    </Box>
                    <Box
                      className={`p-quickadd${soldOut ? " disabled" : ""}`}
                      role="button"
                      tabIndex={soldOut ? -1 : 0}
                      aria-disabled={soldOut || undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!soldOut) onAdd(ele);
                      }}
                      onKeyDown={onActivateKey(() => {
                        if (!soldOut) onAdd(ele);
                      })}
                    >
                      {soldOut ? "Sold Out" : "Add to Cart"}
                    </Box>
                  </Box>
                </Box>
              </Link>
            );
          })}
        </Box>
      </Box>
    </section>
  );
}
