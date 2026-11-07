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
import { onActivateKey } from "../../components/a11y";
import { ProductDetailSkeleton } from "../../components/Loaders";
import type { AppDispatch } from "../../store";
import type { Product } from "../../../lib/types/product";
import type { Review } from "../../../lib/types/review";
import { ProductStatus } from "../../../lib/enums/product.enum";
import { useI18n } from "../../../lib/i18n";
import { rich } from "../../../lib/i18n/rich";

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
  const { t, plural } = useI18n();
  const { productId } = useParams<{ productId: string }>();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [productReviews, setProductReviews] = useState<Review[]>([]);

  /** Slice: Data => Store **/
  const { setChosenProduct, setProducts } = actionDispatch(dispatch);
  const { chosenProduct } = useAppSelector(chosenProductRetriever);
  const catalog = useAppSelector(retrieveProducts);
  const [failedId, setFailedId] = useState<string | null>(null);

  useEffect(() => {
    // Replies for a product the shopper has already left must not land: the
    // previous product's reviews would show under this one.
    let current = true;
    const productService = new ProductService();
    const reviewService = new ReviewService();
    setActiveImage(0);
    setFailedId(null);
    setProductReviews([]);

    productService
      .getProduct(productId)
      .then((data) => {
        if (current) setChosenProduct(data);
      })
      .catch((err) => {
        console.log(err);
        if (current) setFailedId(productId);
      });

    // The catalog backs both the "You may also like" row and the BEST badge,
    // and it has to be fetched here too — landing straight on this URL means
    // the Shop page never ran.
    productService
      .getProducts({ page: 1, limit: CATALOG_LIMIT, order: "createdAt" })
      .then((data) => {
        if (current) setProducts(data);
      })
      .catch((err) => console.log(err));

    reviewService
      .getProductReviews(productId)
      .then((data) => {
        if (current) setProductReviews(data);
      })
      .catch((err) => console.log(err));

    return () => {
      current = false;
    };
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

  // The store still holds the last product opened; until this one arrives,
  // a placeholder — not the previous product under the new URL.
  if (chosenProduct?._id !== productId) {
    if (failedId !== productId) return <ProductDetailSkeleton />;
    return (
      <div className="chosen-product-page">
        <Box className="shop-empty">
          {t("pdp.unavailable")}{" "}
          <Link to="/products">{t("pdp.backToShop")}</Link>
        </Box>
      </div>
    );
  }

  const product = chosenProduct;
  const soldOut = isSoldOut(product);

  return (
    <div className="chosen-product-page">
      <Box component="nav" className="breadcrumb" aria-label={t("pdp.breadcrumb")}>
        <Link to="/">{t("nav.home")}</Link>
        <span className="sep">/</span>
        <Link to="/products">{t("nav.shop")}</Link>
        <span className="sep">/</span>
        <span className="current">{product.productName}</span>
      </Box>

      <Box className="pdp">
        <Box className="pdp-gallery">
          <Box className="pdp-photo">
            {soldOut ? (
              <span className="p-badge soldout">{t("card.soldOutBadge")}</span>
            ) : bestsellers.has(product._id) ? (
              <span className="p-badge best">{t("card.best")}</span>
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
                alt={t("pdp.view", { name: product.productName, n: index + 1 })}
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
                  aria-label={t("pdp.showView", { n: index + 1 })}
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
              {product.productViews}{" "}
              {plural("pdp.viewNoun", product.productViews)}
            </span>
            <a href="#pdp-reviews">
              {t("pdp.seeReviews", {
                count: productReviews.length,
                noun: plural("pdp.reviewNoun", productReviews.length),
              })}
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
              <span className="pdp-save">
                {t("pdp.save", { percent: product.productDiscount })}
              </span>
            ) : null}
          </Box>
          <p className="pdp-desc">{product.productDesc}</p>
          <Box className="qty-row">
            <Box className="qty-stepper">
              <button
                type="button"
                disabled={soldOut}
                aria-label={t("pdp.decrease")}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span>{qty}</span>
              <button
                type="button"
                disabled={soldOut}
                aria-label={t("pdp.increase")}
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </Box>
            <span
              className={`pdp-addbag${soldOut ? " disabled" : ""}`}
              role="button"
              tabIndex={soldOut ? -1 : 0}
              aria-disabled={soldOut || undefined}
              onClick={() => {
                if (soldOut) return;
                if (!onAdd(product, qty)) return;
                setJustAdded(true);
                setTimeout(() => setJustAdded(false), 1200);
              }}
              onKeyDown={onActivateKey(() => {
                if (soldOut) return;
                if (!onAdd(product, qty)) return;
                setJustAdded(true);
                setTimeout(() => setJustAdded(false), 1200);
              })}
            >
              {soldOut
                ? t("card.soldOut")
                : justAdded
                  ? t("pdp.added")
                  : t("pdp.addToBag")}
            </span>
          </Box>
          {soldOut ? (
            <p className="pdp-soldout-note">{t("pdp.soldOutNote")}</p>
          ) : null}
          <Box className="pdp-trust">
            <Box className="pdp-trust-item">
              <span className="ic">
                <TruckIcon />
              </span>
              {t("trust.shipped")}
            </Box>
            <Box className="pdp-trust-item">
              <span className="ic">
                <ShieldIcon />
              </span>
              {t("trust.authentic")}
            </Box>
            <Box className="pdp-trust-item">
              <span className="ic">
                <BoxIcon />
              </span>
              {t("trust.inStock")}
            </Box>
            <Box className="pdp-trust-item">
              <span className="ic">
                <BoltIcon />
              </span>
              {t("trust.dispatch")}
            </Box>
          </Box>
          {product.productHowToUse ? (
            <Box className="pdp-detail">
              <span className="pdp-detail-label">{t("pdp.howToUse")}</span>
              <p>{product.productHowToUse}</p>
            </Box>
          ) : null}
          {product.productSuitableFor ? (
            <Box className="pdp-detail">
              <span className="pdp-detail-label">{t("pdp.suitableFor")}</span>
              <p>{product.productSuitableFor}</p>
            </Box>
          ) : null}
        </Box>
      </Box>

      <section className="section pdp-related">
        <Box className="section-inner">
          <Box className="section-head">
            <Box className="section-heading">
              <span className="eyebrow">{t("pdp.pairsEyebrow")}</span>
              <Box className="section-title">{rich(t("pdp.alsoLike"))}</Box>
            </Box>
            <Link to="/products" className="section-link">
              {t("common.viewAll")}
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
                        <span className="p-badge soldout">{t("card.soldOutBadge")}</span>
                      ) : bestsellers.has(ele._id) ? (
                        <span className="p-badge best">{t("card.best")}</span>
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
                        role="button"
                        tabIndex={eleSoldOut ? -1 : 0}
                        aria-disabled={eleSoldOut || undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!eleSoldOut) onAdd(ele);
                        }}
                        onKeyDown={onActivateKey(() => {
                          if (!eleSoldOut) onAdd(ele);
                        })}
                      >
                        {eleSoldOut ? t("card.soldOut") : t("card.addToCart")}
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
              <span className="eyebrow">{t("reviews.eyebrow")}</span>
              <Box className="section-title">{rich(t("pdp.reviewsTitle"))}</Box>
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
                    {t("pdp.verified")}
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box className="review-empty">{t("pdp.noReviews")}</Box>
          )}
        </Box>
      </section>
    </div>
  );
}
