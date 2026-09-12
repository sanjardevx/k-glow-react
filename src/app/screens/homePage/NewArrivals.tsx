import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { finalPrice, formatPrice } from "../productsPage/productsData";
import { useAppSelector } from "../../hooks";
import { useBasket } from "../cartPage/useBasket";
import { useReveal } from "../../components/useReveal";
import { retrieveNewArrivals } from "./selector";
import { serverApi } from "../../../lib/config";

export function NewArrivals() {
  const { onAdd } = useBasket();
  const newArrivals = useAppSelector(retrieveNewArrivals);
  const revealRef = useReveal<HTMLElement>();

  return (
    <section className="section reveal" ref={revealRef}>
      <Box className="section-inner">
        <Box className="section-head">
          <Box className="section-heading">
            <span className="eyebrow">Just landed</span>
            <Box className="section-title">
              New <em>arrivals</em>
            </Box>
          </Box>
          <Link to="/products" className="section-link">
            View all →
          </Link>
        </Box>
        <Box className="product-grid product-grid-6">
          {newArrivals.map((ele) => {
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
                      <span className="p-badge new">NEW</span>
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!soldOut) onAdd(ele);
                      }}
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
