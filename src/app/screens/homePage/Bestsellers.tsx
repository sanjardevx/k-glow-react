import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { finalPrice, formatPrice } from "../productsPage/productsData";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addItem } from "../cartPage/cartSlice";
import { retrieveBestsellers } from "./selector";
import { serverApi } from "../../../lib/config";

export function Bestsellers() {
  const dispatch = useAppDispatch();
  const bestsellers = useAppSelector(retrieveBestsellers);

  return (
    <section className="section">
      <Box className="section-inner">
        <Box className="section-head">
          <Box className="section-title">
            Best<em>sellers</em>
          </Box>
          <Link
            to={{ pathname: "/products", search: "?category=bestseller" }}
            className="section-link"
          >
            View all →
          </Link>
        </Box>
        <Box className="product-grid">
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!soldOut) dispatch(addItem({ productId: ele._id }));
                      }}
                    >
                      {soldOut ? "Sold Out" : "Quick Add"}
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
