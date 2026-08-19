import { Box } from "@mui/material";
import { getProductById } from "../productsPage/productsData";
import { getFeaturedReviews } from "../productsPage/reviewsData";

export function Reviews() {
  const featured = getFeaturedReviews(3);

  return (
    <section className="section reviews">
      <Box className="reviews-head">
        <span className="reviews-badge">❝ Customer Love</span>
        <Box className="section-title">
          What Our <em>Beauty Queens</em> Say
        </Box>
        <p className="reviews-sub">
          Real words from real customers — no scripts, no stock photos.
        </p>
      </Box>
      <Box className="review-grid">
        {featured.map((ele, index) => {
          const product = getProductById(ele.productId);
          return (
            <Box className="review-card" key={index}>
              <Box className="review-stars">
                <span className="star">{"★".repeat(ele.reviewStars)}</span>
                {ele.reviewStars < 5 ? (
                  <span className="star empty">
                    {"★".repeat(5 - ele.reviewStars)}
                  </span>
                ) : null}
              </Box>
              <p className="review-text">{ele.reviewText}</p>
              <Box className="review-meta">
                <Box className="review-name">{ele.reviewerName}</Box>
                {product ? (
                  <Box className="review-product">
                    {product.productBrand} {product.productName}
                  </Box>
                ) : null}
              </Box>
              <Box className="verified">
                <span className="verified-dot">✓</span>
                Tasdiqlangan xaridor
              </Box>
            </Box>
          );
        })}
      </Box>
    </section>
  );
}
