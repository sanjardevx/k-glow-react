import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { createSelector } from "@reduxjs/toolkit";
import { finalPrice, formatPrice } from "./productsData";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useBasket } from "../cartPage/useBasket";
import { setProducts } from "./slice";
import { retrieveProducts } from "./selector";
import ProductService from "../../services/ProductService";
import { serverApi } from "../../../lib/config";
import type { AppDispatch } from "../../store";
import type { Product, ProductInquiry } from "../../../lib/types/product";
import {
  ProductCategory,
  ProductStatus,
} from "../../../lib/enums/product.enum";

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: AppDispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});
const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

const chips = ["All", "Bestseller", "Sale", "Skincare", "Makeup", "Sets"] as const;
type Chip = (typeof chips)[number];
const PAGE_SIZE = 8;

/**
 * Search runs on the server (`productSearch.search`), the chips filter what
 * comes back in the browser. The chips stay client-side because two of them
 * can't be expressed as a backend query — "Bestseller" is a top-N slice of the
 * view counts, and "Sale" needs a discount field the API doesn't have — and a
 * split where some chips refetch and others don't would be worse than either.
 * Since every fetch asks for the whole matching set, the two stay consistent.
 */
const FETCH_LIMIT = 100;
const BESTSELLER_COUNT = 4;

function chipFromQuery(search: string): Chip {
  const category = new URLSearchParams(search).get("category")?.toLowerCase();
  const match = chips.find((c) => c.toLowerCase() === category);
  return match ?? "All";
}

export function Products() {
  const dispatch = useAppDispatch();
  const { onAdd } = useBasket();
  const location = useLocation();
  const [activeChip, setActiveChip] = useState<Chip>(() =>
    chipFromQuery(location.search),
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: FETCH_LIMIT,
    order: "createdAt",
    search: "",
  });
  const [searchText, setSearchText] = useState("");

  /** Slice: Data => Store **/
  const { setProducts } = actionDispatch(dispatch);
  const { products } = useAppSelector(productsRetriever);

  useEffect(() => {
    const productService = new ProductService();
    productService
      .getProducts(productSearch)
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, [productSearch]);

  // Emptying the box restores the full catalog without needing a second Enter.
  useEffect(() => {
    if (searchText !== "") return;
    setProductSearch((prev) =>
      prev.search === "" ? prev : { ...prev, page: 1, search: "" },
    );
  }, [searchText]);

  /** HANDLERS **/
  function searchProductHandler() {
    setVisibleCount(PAGE_SIZE);
    setProductSearch((prev) =>
      prev.search === searchText ? prev : { ...prev, page: 1, search: searchText },
    );
  }

  const bestsellers = useMemo(() => {
    const top = [...products]
      .sort((a, b) => b.productViews - a.productViews)
      .slice(0, BESTSELLER_COUNT);
    return new Set(top.map((p) => p._id));
  }, [products]);

  const filtered = useMemo(() => {
    if (activeChip === "All") return products;
    if (activeChip === "Bestseller")
      return products.filter((p) => bestsellers.has(p._id));
    if (activeChip === "Sale") return products.filter((p) => p.productDiscount);
    const category = activeChip.toUpperCase() as ProductCategory;
    return products.filter((p) => p.productCategory === category);
  }, [activeChip, products, bestsellers]);

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  function selectChip(chip: Chip) {
    setActiveChip(chip);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="shop-page">
      <Box className="shop-head">
        <Box className="shop-title">Shop</Box>
        <Box className="shop-head-right">
          <Box className="shop-count">{filtered.length} products</Box>
          <Box
            component="form"
            className="shop-search"
            onSubmit={(e) => {
              e.preventDefault();
              searchProductHandler();
            }}
          >
            <input
              type="search"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button type="submit" className="shop-search-icon" aria-label="Search">
              🔍
            </button>
          </Box>
        </Box>
      </Box>

      <Box className="chip-row">
        {chips.map((chip) => (
          <span
            key={chip}
            className={`chip${activeChip === chip ? " active" : ""}`}
            onClick={() => selectChip(chip)}
          >
            {chip}
          </span>
        ))}
      </Box>

      <Box className="shop-grid-wrap">
        {visibleItems.length !== 0 ? (
          <Box className="product-grid">
            {visibleItems.map((ele) => {
              const soldOut = ele.productStatus === ProductStatus.PAUSE;
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
                        className={`p-quickadd${soldOut ? " disabled" : ""}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!soldOut) onAdd(ele);
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
        ) : (
          <Box className="shop-empty">
            {productSearch.search
              ? `No products match "${productSearch.search}".`
              : "No products in this category yet — check back soon."}
          </Box>
        )}

        {hasMore ? (
          <Box className="load-more-wrap">
            <button
              type="button"
              className="load-more-btn"
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            >
              Load more products
            </button>
          </Box>
        ) : null}
      </Box>
    </div>
  );
}
