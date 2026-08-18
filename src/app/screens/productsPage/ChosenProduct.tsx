import { useState } from "react";
import { Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { products } from "./productsData";

export function ChosenProduct() {
  const { productId } = useParams<{ productId: string }>();
  const [qty, setQty] = useState(1);

  const index = Number(productId);
  const product =
    Number.isInteger(index) && products[index] ? products[index] : products[1];
  const resolvedId = products.indexOf(product);

  const sameCategory = products.filter(
    (p, i) => i !== resolvedId && p.category === product.category,
  );
  const otherCategory = products.filter(
    (p, i) => i !== resolvedId && p.category !== product.category,
  );
  const related = [...sameCategory, ...otherCategory].slice(0, 4);

  return (
    <div className="chosen-product-page">
      <Box className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <Link to="/products">Shop</Link>
        <span className="sep">/</span>
        {product.productName}
      </Box>

      <Box className="pdp">
        <Box className="pdp-photo">
          {product.isBestseller ? (
            <span className="p-badge best">BEST</span>
          ) : product.productDiscount ? (
            <span className="p-badge sale">−{product.productDiscount}%</span>
          ) : null}
          <img src={product.imagePath} alt={product.productName} />
        </Box>
        <Box className="pdp-info">
          <Box className="pdp-brand">{product.productBrand}</Box>
          <Box component="h1" className="pdp-title">
            {product.productName}
          </Box>
          <Box className="pdp-rating">
            <span className="star">{"★".repeat(product.stars)}</span>
            {product.stars < 5 ? (
              <span className="star empty">
                {"★".repeat(5 - product.stars)}
              </span>
            ) : null}
            <a href="#pdp-reviews">See {product.reviews} reviews</a>
          </Box>
          <Box className="pdp-price-row">
            <span className="pdp-price">{product.productPrice}</span>
            {product.productOldPrice ? (
              <span className="pdp-price-old">{product.productOldPrice}</span>
            ) : null}
            {product.productDiscount ? (
              <span className="pdp-save">Save {product.productDiscount}%</span>
            ) : null}
          </Box>
          <p className="pdp-desc">{product.description}</p>
          <Box className="qty-row">
            <Box className="qty-stepper">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </Box>
            <span className="pdp-addbag">Add to Bag</span>
          </Box>
          <Box className="pdp-trust">
            <Box className="pdp-trust-item">
              <span className="ic">🚚</span>Shipped from Korea
            </Box>
            <Box className="pdp-trust-item">
              <span className="ic">🛡</span>100% authentic
            </Box>
            <Box className="pdp-trust-item">
              <span className="ic">📦</span>Usually in stock
            </Box>
            <Box className="pdp-trust-item">
              <span className="ic">⚡</span>Same-day dispatch via BTS post
            </Box>
          </Box>
        </Box>
      </Box>

      <section className="section">
        <Box className="section-inner">
          <Box className="section-head">
            <Box className="section-title">
              You may also <em>like</em>
            </Box>
          </Box>
          <Box className="product-grid">
            {related.map((ele) => {
              const id = products.indexOf(ele);
              return (
                <Link to={`/products/${id}`} className="p-card-link" key={id}>
                  <Box className="p-card">
                    <Box className="p-photo">
                      {ele.isBestseller ? (
                        <span className="p-badge best">BEST</span>
                      ) : null}
                      {ele.productDiscount ? (
                        <span className="p-badge sale">
                          −{ele.productDiscount}%
                        </span>
                      ) : null}
                      <Box className="p-photo-frame">
                        <img src={ele.imagePath} alt={ele.productName} />
                      </Box>
                    </Box>
                    <Box className="p-body">
                      <Box className="p-brand">{ele.productBrand}</Box>
                      <Box className="p-name">{ele.productName}</Box>
                      <Box className="p-stars">
                        <span className="star">
                          {"★".repeat(ele.stars)}
                        </span>
                        {ele.stars < 5 ? (
                          <span className="star empty">
                            {"★".repeat(5 - ele.stars)}
                          </span>
                        ) : null}
                        <span>({ele.reviews})</span>
                      </Box>
                      <Box className="p-price-row">
                        <span className="p-price">{ele.productPrice}</span>
                        {ele.productOldPrice ? (
                          <span className="p-price-old">
                            {ele.productOldPrice}
                          </span>
                        ) : null}
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

      <section className="section reviews" id="pdp-reviews">
        <Box className="section-inner">
          <Box className="section-head">
            <Box className="section-title">
              Reviews for this <em>product</em>
            </Box>
            <span className="section-link">See all {product.reviews} →</span>
          </Box>
          <Box
            className="review-grid"
            style={{
              gridTemplateColumns: "repeat(2, 1fr)",
              maxWidth: "640px",
            }}
          >
            {["/img/reviews/review-1.jpeg", "/img/reviews/review-2.jpeg"].map(
              (img, i) => (
                <Box className="review-card" key={i}>
                  <Box className="review-stars">
                    <span className="star">★★★★★</span>
                  </Box>
                  <Box className="review-shot">
                    <img src={img} alt={`${product.productName} review`} />
                  </Box>
                  <Box className="review-product">{product.productName}</Box>
                  <Box className="verified">
                    <span className="verified-dot">✓</span>
                    Verified purchase
                  </Box>
                </Box>
              ),
            )}
          </Box>
        </Box>
      </section>
    </div>
  );
}
