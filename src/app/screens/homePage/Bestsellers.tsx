import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { products } from "../productsPage/productsData";

export function Bestsellers() {
  const bestsellers = products.filter((p) => p.isBestseller);

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
            const id = products.indexOf(ele);
            return (
              <Link to={`/products/${id}`} className="p-card-link" key={id}>
                <Box className="p-card">
                  <Box className="p-photo">
                    <span className="p-badge top">TOP</span>
                    <Box className="p-photo-frame">
                      <img src={ele.imagePath} alt={ele.productName} />
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
                      <span className="p-price">{ele.productPrice}</span>
                    </Box>
                    <Box
                      className="p-quickadd"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      Quick Add
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
