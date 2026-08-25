import { useState } from "react";
import { Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import {
  finalPrice,
  formatPrice,
  getProductById,
  isBestseller,
  isSoldOut,
  products,
} from "./productsData";
import { getReviewsForProduct } from "./reviewsData";
import { createSelector } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../hooks";
import { addItem } from "../cartPage/cartSlice";
import { setChosenProduct } from "./slice";
import { retrieveChosenProduct } from "./selector";
import type { AppDispatch } from "../../store";
import type { Product } from "../../../lib/types/product";

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: AppDispatch) => ({
  setChosenProduct: (data: Product | null) => dispatch(setChosenProduct(data)),
});
const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({ chosenProduct }),
);

export function ChosenProduct() {
  const dispatch = useAppDispatch();
  const { productId } = useParams<{ productId: string }>();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const product = getProductById(productId ?? "") ?? products[1];
  const resolvedId = products.indexOf(product);

  const sameCategory = products.filter(
    (p, i) => i !== resolvedId && p.productCategory === product.productCategory,
  );
  const otherCategory = products.filter(
    (p, i) => i !== resolvedId && p.productCategory !== product.productCategory,
  );
  const related = [...sameCategory, ...otherCategory].slice(0, 4);

  const productReviews = getReviewsForProduct(String(resolvedId));

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
          {isSoldOut(product) ? (
            <span className="p-badge soldout">SOLD OUT</span>
          ) : isBestseller(product) ? (
            <span className="p-badge best">BEST</span>
          ) : product.productDiscount ? (
            <span className="p-badge sale">−{product.productDiscount}%</span>
          ) : null}
          <img src={product.productImages[0]} alt={product.productName} />
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
            <span className="pdp-price">{formatPrice(finalPrice(product))}</span>
            {product.productDiscount ? (
              <span className="pdp-price-old">
                {formatPrice(product.productPrice)}
              </span>
            ) : null}
            {product.productDiscount ? (
              <span className="pdp-save">Save {product.productDiscount}%</span>
            ) : null}
          </Box>
          <p className="pdp-desc">{product.productDesc}</p>
          <Box className="qty-row">
            <Box className="qty-stepper">
              <button
                type="button"
                disabled={isSoldOut(product)}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span>{qty}</span>
              <button
                type="button"
                disabled={isSoldOut(product)}
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </Box>
            <span
              className={`pdp-addbag${isSoldOut(product) ? " disabled" : ""}`}
              onClick={() => {
                if (isSoldOut(product)) return;
                dispatch(addItem({ productId: resolvedId, quantity: qty }));
                setJustAdded(true);
                setTimeout(() => setJustAdded(false), 1200);
              }}
            >
              {isSoldOut(product) ? "Sold Out" : justAdded ? "Added ✓" : "Add to Bag"}
            </span>
          </Box>
          {isSoldOut(product) ? (
            <p className="pdp-soldout-note">
              This product is temporarily out of stock — check back soon.
            </p>
          ) : null}
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
                  <Box className={`p-card${isSoldOut(ele) ? " soldout" : ""}`}>
                    <Box className="p-photo">
                      {isSoldOut(ele) ? (
                        <span className="p-badge soldout">SOLD OUT</span>
                      ) : isBestseller(ele) ? (
                        <span className="p-badge best">BEST</span>
                      ) : ele.productDiscount ? (
                        <span className="p-badge sale">
                          −{ele.productDiscount}%
                        </span>
                      ) : null}
                      <Box className="p-photo-frame">
                        <img src={ele.productImages[0]} alt={ele.productName} />
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

      <section className="section reviews" id="pdp-reviews">
        <Box className="section-inner">
          <Box className="section-head">
            <Box className="section-title">
              Reviews for this <em>product</em>
            </Box>
            <span className="section-link">See all {product.reviews} →</span>
          </Box>
          {productReviews.length !== 0 ? (
            <Box
              className="review-grid"
              style={{
                gridTemplateColumns: "repeat(2, 1fr)",
                maxWidth: "820px",
              }}
            >
              {productReviews.map((review, i) => (
                <Box className="review-card" key={i}>
                  <Box className="review-stars">
                    <span className="star">{"★".repeat(review.reviewStars)}</span>
                    {review.reviewStars < 5 ? (
                      <span className="star empty">
                        {"★".repeat(5 - review.reviewStars)}
                      </span>
                    ) : null}
                  </Box>
                  <p className="review-text">{review.reviewText}</p>
                  <Box className="review-meta">
                    <Box className="review-name">{review.reviewerName}</Box>
                    <Box className="review-product">{product.productName}</Box>
                  </Box>
                  <Box className="verified">
                    <span className="verified-dot">✓</span>
                    Verified purchase
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box className="review-empty">
              No reviews for this product yet — yours could be the first.
            </Box>
          )}
        </Box>
      </section>
    </div>
  );
}
