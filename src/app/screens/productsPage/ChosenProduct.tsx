import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { finalPrice, formatPrice } from "./productsData";
import { createSelector } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useBasket } from "../cartPage/useBasket";
import { setChosenProduct, setProducts } from "./slice";
import { retrieveChosenProduct, retrieveProducts } from "./selector";
import ProductService from "../../services/ProductService";
import ReviewService from "../../services/ReviewService";
import { serverApi } from "../../../lib/config";
import {
  BoltIcon,
  BoxIcon,
  EyeIcon,
  ShieldIcon,
  TruckIcon,
} from "../../components/icons";
import type { AppDispatch } from "../../store";
import type { Product } from "../../../lib/types/product";
import type { Review } from "../../../lib/types/review";
import { ProductStatus } from "../../../lib/enums/product.enum";

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: AppDispatch) => ({
  setChosenProduct: (data: Product | null) => dispatch(setChosenProduct(data)),
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});
const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({ chosenProduct }),
);

const CATALOG_LIMIT = 100;
const RELATED_COUNT = 5;
const BESTSELLER_COUNT = 5;

function isSoldOut(product: Product): boolean {
  return product.productStatus === ProductStatus.PAUSE;
}

export function ChosenProduct() {
  const dispatch = useAppDispatch();
  const { onAdd } = useBasket();
  const { productId } = useParams<{ productId: string }>();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [productReviews, setProductReviews] = useState<Review[]>([]);

  /** Slice: Data => Store **/
  const { setChosenProduct, setProducts } = actionDispatch(dispatch);
  const { chosenProduct } = useAppSelector(chosenProductRetriever);
  const catalog = useAppSelector(retrieveProducts);

  useEffect(() => {
    const productService = new ProductService();
    const reviewService = new ReviewService();
    setActiveImage(0);

    productService
      .getProduct(productId)
      .then((data) => setChosenProduct(data))
      .catch((err) => console.log(err));

    // The catalog backs both the "You may also like" row and the BEST badge,
    // and it has to be fetched here too — landing straight on this URL means
    // the Shop page never ran.
    productService
      .getProducts({ page: 1, limit: CATALOG_LIMIT, order: "createdAt" })
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));

    reviewService
      .getProductReviews(productId)
      .then((data) => setProductReviews(data))
      .catch((err) => console.log(err));
  }, [productId]);

  const bestsellers = useMemo(() => {
    const top = [...catalog]
      .sort((a, b) => b.productViews - a.productViews)
      .slice(0, BESTSELLER_COUNT);
    return new Set(top.map((p) => p._id));
  }, [catalog]);

  const related = useMemo(() => {
    if (!chosenProduct) return [];
    const others = catalog.filter((p) => p._id !== chosenProduct._id);
    const sameCategory = others.filter(
      (p) => p.productCategory === chosenProduct.productCategory,
    );
    const otherCategory = others.filter(
      (p) => p.productCategory !== chosenProduct.productCategory,
    );
    return [...sameCategory, ...otherCategory].slice(0, RELATED_COUNT);
  }, [catalog, chosenProduct]);

  if (!chosenProduct) return null;

  const product = chosenProduct;
  const soldOut = isSoldOut(product);

  return (
    <div className="chosen-product-page">
      <Box component="nav" className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <Link to="/products">Shop</Link>
        <span className="sep">/</span>
        <span className="current">{product.productName}</span>
      </Box>

      <Box className="pdp">
        <Box className="pdp-gallery">
          <Box className="pdp-photo">
            {soldOut ? (
              <span className="p-badge soldout">SOLD OUT</span>
            ) : bestsellers.has(product._id) ? (
              <span className="p-badge best">BEST</span>
            ) : product.productDiscount ? (
              <span className="p-badge sale">−{product.productDiscount}%</span>
            ) : null}
            {/* Every shot is in the DOM from the start, so switching is a
                crossfade between decoded images rather than a fresh load. */}
            {product.productImages.map((image, index) => (
              <img
                key={image}
                className={index === activeImage ? "active" : undefined}
                src={`${serverApi}/${image}`}
                alt={`${product.productName} — view ${index + 1}`}
                aria-hidden={index !== activeImage}
              />
            ))}
          </Box>

          {product.productImages.length > 1 ? (
            <Box className="pdp-thumbs">
              {product.productImages.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  className={`pdp-thumb${index === activeImage ? " active" : ""}`}
                  aria-label={`Show view ${index + 1}`}
                  aria-current={index === activeImage}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={`${serverApi}/${image}`} alt="" />
                </button>
              ))}
            </Box>
          ) : null}
        </Box>
        <Box className="pdp-info">
          <Box className="pdp-brand">{product.productBrand}</Box>
          <Box component="h1" className="pdp-title">
            {product.productName}
          </Box>
          <Box className="pdp-rating">
            <span className="pdp-views">
              <EyeIcon />
              {product.productViews} views
            </span>
            <a href="#pdp-reviews">
              See {productReviews.length}{" "}
              {productReviews.length === 1 ? "review" : "reviews"}
            </a>
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
                disabled={soldOut}
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span>{qty}</span>
              <button
                type="button"
                disabled={soldOut}
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </Box>
            <span
              className={`pdp-addbag${soldOut ? " disabled" : ""}`}
              role="button"
              onClick={() => {
                if (soldOut) return;
                if (!onAdd(product, qty)) return;
                setJustAdded(true);
                setTimeout(() => setJustAdded(false), 1200);
              }}
            >
              {soldOut ? "Sold Out" : justAdded ? "Added ✓" : "Add to Bag"}
            </span>
          </Box>
          {soldOut ? (
            <p className="pdp-soldout-note">
              This product is temporarily out of stock — check back soon.
            </p>
          ) : null}
          <Box className="pdp-trust">
            <Box className="pdp-trust-item">
              <span className="ic">
                <TruckIcon />
              </span>
              Shipped from Korea
            </Box>
            <Box className="pdp-trust-item">
              <span className="ic">
                <ShieldIcon />
              </span>
              100% authentic
            </Box>
            <Box className="pdp-trust-item">
              <span className="ic">
                <BoxIcon />
              </span>
              Usually in stock
            </Box>
            <Box className="pdp-trust-item">
              <span className="ic">
                <BoltIcon />
              </span>
              Same-day dispatch via BTS post
            </Box>
          </Box>
          {product.productHowToUse ? (
            <Box className="pdp-detail">
              <span className="pdp-detail-label">How to use</span>
              <p>{product.productHowToUse}</p>
            </Box>
          ) : null}
          {product.productSuitableFor ? (
            <Box className="pdp-detail">
              <span className="pdp-detail-label">Suitable for</span>
              <p>{product.productSuitableFor}</p>
            </Box>
          ) : null}
        </Box>
      </Box>

      <section className="section pdp-related">
        <Box className="section-inner">
          <Box className="section-head">
            <Box className="section-heading">
              <span className="eyebrow">Pairs well with</span>
              <Box className="section-title">
                You may also <em>like</em>
              </Box>
            </Box>
            <Link to="/products" className="section-link">
              View all →
            </Link>
          </Box>
          <Box className="product-grid">
            {related.map((ele) => {
              const eleSoldOut = isSoldOut(ele);
              return (
                <Link
                  to={`/products/${ele._id}`}
                  className="p-card-link"
                  key={ele._id}
                >
                  <Box className={`p-card${eleSoldOut ? " soldout" : ""}`}>
                    <Box className="p-photo">
                      {eleSoldOut ? (
                        <span className="p-badge soldout">SOLD OUT</span>
                      ) : bestsellers.has(ele._id) ? (
                        <span className="p-badge best">BEST</span>
                      ) : ele.productDiscount ? (
                        <span className="p-badge sale">
                          −{ele.productDiscount}%
                        </span>
                      ) : null}
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
                        className={`p-quickadd${eleSoldOut ? " disabled" : ""}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!eleSoldOut) onAdd(ele);
                        }}
                      >
                        {eleSoldOut ? "Sold Out" : "Add to Cart"}
                      </Box>
                    </Box>
                  </Box>
                </Link>
              );
            })}
          </Box>
        </Box>
      </section>

      <section className="section reviews pdp-reviews" id="pdp-reviews">
        <Box className="section-inner">
          <Box className="section-head">
            <Box className="section-heading">
              <span className="eyebrow">Customer love</span>
              <Box className="section-title">
                Reviews for this <em>product</em>
              </Box>
            </Box>
          </Box>
          {productReviews.length !== 0 ? (
            <Box className="review-grid review-grid-pdp">
              {productReviews.map((review) => (
                <Box className="review-card" key={review._id}>
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
