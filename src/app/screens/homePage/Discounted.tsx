import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import {
  finalPrice,
  formatPrice,
  isSoldOut,
  products,
} from "../productsPage/productsData";
import { useAppDispatch } from "../../hooks";
import { addItem } from "../cartPage/cartSlice";

export function Discounted() {
  const dispatch = useAppDispatch();
  const discounted = products.filter((p) => p.productDiscount);

  return (
    <section className="section">
      <Box className="section-inner">
        <Box className="section-head">
          <Box className="section-title">
            Discounted <em>picks</em>
          </Box>
          <Link
            to={{ pathname: "/products", search: "?category=sale" }}
            className="section-link"
          >
            View all →
          </Link>
        </Box>
        <Box className="product-grid">
          {discounted.map((ele) => {
            const id = products.indexOf(ele);
            return (
              <Link to={`/products/${id}`} className="p-card-link" key={id}>
                <Box className={`p-card${isSoldOut(ele) ? " soldout" : ""}`}>
                  <Box className="p-photo">
                    {isSoldOut(ele) ? (
                      <span className="p-badge soldout">SOLD OUT</span>
                    ) : (
                      <span className="p-badge sale">
                        −{ele.productDiscount}%
                      </span>
                    )}
                    <Box className="p-photo-frame">
                      <img src={ele.productImages[0]} alt={ele.productName} />
                    </Box>
                  </Box>
                  <Box className="p-body">
                    <Box className="p-brand">{ele.productBrand}</Box>
                    <Box className="p-name">{ele.productName}</Box>
                    <Box className="p-stars">
                      <span className="star">{"★".repeat(ele.stars)}</span>
                      {ele.stars < 5 ? (
                        <span className="star empty">
                          {"★".repeat(5 - ele.stars)}
                        </span>
                      ) : null}
                      <span>({ele.reviews})</span>
                    </Box>
                    <Box className="p-price-row">
                      <span className="p-price">
                        {formatPrice(finalPrice(ele))}
                      </span>
                      <span className="p-price-old">
                        {formatPrice(ele.productPrice)}
                      </span>
                    </Box>
                    <Box
                      className={`p-quickadd${isSoldOut(ele) ? " disabled" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isSoldOut(ele)) dispatch(addItem({ productId: id }));
                      }}
                    >
                      {isSoldOut(ele) ? "Sold Out" : "Quick Add"}
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
