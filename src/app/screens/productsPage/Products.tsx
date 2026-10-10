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
import { ChevronDownIcon, SearchIcon } from "../../components/icons";
import { onActivateKey } from "../../components/a11y";
import { ProductCardSkeletons } from "../../components/Loaders";
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

/**
 * The chips the catalog can actually back: "All" (no filter), the two computed
 * views "Bestseller" (top-N by views) and "Sale" (has a discount), and the
 * three stored categories. Finer product-type chips were dropped — they only
 * matched product names by regex, which silently misfiles anything oddly
 * named; add them back as a real `productType` field if the shop ever needs
 * sub-types.
 */
const chips = [
  "All",
  "Bestseller",
  "Sale",
  "Skincare",
  "Makeup",
  "Sets",
] as const;
type Chip = (typeof chips)[number];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "top-rated", label: "Top Rated" },
] as const;
type SortValue = (typeof sortOptions)[number]["value"];

// The grid shows this many first, then a Load More button reveals the next
// batch of the same size. 10 is two full rows of the 5-wide desktop grid.
const PAGE_SIZE = 10;

/**
 * Search runs on the server (`productSearch.search`), the chips and the sort
 * work on what comes back in the browser. The chips stay client-side because
 * neither computed view can be expressed as a backend query — "Bestseller" is
 * a top-N slice of the view counts and "Sale" needs a discount field the API
 * doesn't have — and a split where some chips refetch and others don't would
 * be worse than either. Since every fetch asks for the whole matching set,
 * the two stay consistent.
 */
const FETCH_LIMIT = 100;
const BESTSELLER_COUNT = 5;

function chipFromQuery(search: string): Chip {
  const category = new URLSearchParams(search).get("category")?.toLowerCase();
  const match = chips.find((c) => c.toLowerCase() === category);
  return match ?? "All";
}

/** `?search=` lets another page hand the shop a starting query — the
 *  tutorials feed uses it to link a video's brand here. The backend already
 *  matches a search term against the brand as well as the product name. */
function searchFromQuery(search: string): string {
  return new URLSearchParams(search).get("search")?.trim() ?? "";
}

export function Products() {
  const dispatch = useAppDispatch();
  const { onAdd } = useBasket();
  const location = useLocation();
  const [activeChip, setActiveChip] = useState<Chip>(() =>
    chipFromQuery(location.search),
  );
  const [sort, setSort] = useState<SortValue>("featured");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [productSearch, setProductSearch] = useState<ProductInquiry>(() => ({
    page: 1,
    limit: FETCH_LIMIT,
    order: "createdAt",
    search: searchFromQuery(location.search),
  }));
  const [searchText, setSearchText] = useState(() =>
    searchFromQuery(location.search),
  );

  /** Slice: Data => Store **/
  const { setProducts } = actionDispatch(dispatch);
  const { products } = useAppSelector(productsRetriever);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only the latest search may land: typing fast can leave an older,
    // slower reply arriving last and replacing the results the shopper wants.
    let current = true;
    setLoading(true);
    const productService = new ProductService();
    productService
      .getProducts(productSearch)
      .then((data) => {
        if (current) setProducts(data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => {
      current = false;
    };
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

  // "Featured" keeps the server order (newest first). "Top Rated" ranks by
  // views — the closest signal the catalog carries until ratings exist.
  const sorted = useMemo(() => {
    if (sort === "featured") return filtered;
    const list = [...filtered];
    if (sort === "price-asc")
      list.sort((a, b) => finalPrice(a) - finalPrice(b));
    if (sort === "price-desc")
      list.sort((a, b) => finalPrice(b) - finalPrice(a));
    if (sort === "top-rated")
      list.sort((a, b) => b.productViews - a.productViews);
    return list;
  }, [filtered, sort]);

  const visibleItems = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  function selectChip(chip: Chip) {
    setActiveChip(chip);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="shop-page">
      <Box className="shop-head">
        <Box className="shop-heading">
          <span className="eyebrow">Our catalog</span>
          <h1 className="shop-title">Shop</h1>
          <Box className="shop-count">
            {sorted.length} {sorted.length === 1 ? "product" : "products"}
          </Box>
        </Box>

        <Box className="shop-tools">
          <Box
            component="form"
            className="shop-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              searchProductHandler();
            }}
          >
            <SearchIcon className="shop-search-glyph" />
            <input
              type="search"
              placeholder="Search products…"
              aria-label="Search products"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button type="submit" className="shop-search-submit">
              Search
            </button>
          </Box>

          <label className="shop-sort">
            <span className="shop-sort-label">Sort</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortValue);
                setVisibleCount(PAGE_SIZE);
              }}
              aria-label="Sort products"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="shop-sort-chevron" />
          </label>
        </Box>
      </Box>

      <Box className="chip-row" role="tablist" aria-label="Product categories">
        {chips.map((chip) => (
          <button
            type="button"
            key={chip}
            role="tab"
            aria-selected={activeChip === chip}
            className={`chip${activeChip === chip ? " active" : ""}`}
            onClick={() => selectChip(chip)}
          >
            {chip}
          </button>
        ))}
      </Box>

      <Box className="shop-grid-wrap">
        {visibleItems.length !== 0 ? (
          // A new search keeps the current results up, dimmed, rather than
          // flashing placeholders on every Enter.
          <Box
            className={`product-grid${loading ? " is-refreshing" : ""}`}
            aria-busy={loading}
          >
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
        ) : loading ? (
          // Nothing to show yet: placeholders, not "no products" — that
          // message would be wrong for the second it takes to load.
          <Box className="product-grid">
            <ProductCardSkeletons count={PAGE_SIZE} />
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
