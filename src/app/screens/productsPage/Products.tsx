import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  finalPrice,
  formatPrice,
  getBestsellers,
  isSoldOut,
  products,
  type ProductCategory,
} from "./productsData";
import { createSelector } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../hooks";
import { addItem } from "../cartPage/cartSlice";
import { setProducts } from "./slice";
import { retrieveProducts } from "./selector";
import type { AppDispatch } from "../../store";
import type { Product } from "../../../lib/types/product";

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

function chipFromQuery(search: string): Chip {
  const category = new URLSearchParams(search).get("category")?.toLowerCase();
  const match = chips.find((c) => c.toLowerCase() === category);
  return match ?? "All";
}

export function Products() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [activeChip, setActiveChip] = useState<Chip>(() =>
    chipFromQuery(location.search),
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const bestsellers = useMemo(() => new Set(getBestsellers()), []);

  const filtered = useMemo(() => {
    if (activeChip === "All") return products;
    if (activeChip === "Bestseller")
      return products.filter((p) => bestsellers.has(p));
    if (activeChip === "Sale") return products.filter((p) => p.productDiscount);
    const category = activeChip.toUpperCase() as ProductCategory;
    return products.filter((p) => p.productCategory === category);
  }, [activeChip, bestsellers]);

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
            onSubmit={(e) => e.preventDefault()}
          >
            <input type="search" placeholder="Search products..." />
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
              const id = products.indexOf(ele);
              return (
                <Link
                  to={`/products/${id}`}
                  className="p-card-link"
                  key={id}
                >
                  <Box className={`p-card${isSoldOut(ele) ? " soldout" : ""}`}>
                    <Box className="p-photo">
                      {isSoldOut(ele) ? (
                        <span className="p-badge soldout">SOLD OUT</span>
                      ) : bestsellers.has(ele) ? (
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
        ) : (
          <Box className="shop-empty">
            No products in this category yet — check back soon.
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
