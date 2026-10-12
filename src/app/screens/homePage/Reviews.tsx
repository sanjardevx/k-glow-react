import { Box } from "@mui/material";
import { useAppSelector } from "../../hooks";
import { useReveal } from "../../components/useReveal";
import { retrieveReviews } from "./selector";
import { ReviewGridSkeleton } from "../../components/Loaders";

export function Reviews({ loading }: { loading: boolean }) {
  const reviews = useAppSelector(retrieveReviews);
  const revealRef = useReveal<HTMLElement>();

  // Nothing settled and nothing arrived: the shop is unreachable or the list
  // is genuinely empty. Either way a heading over a void is worse than no
  // section at all, so the homepage closes the gap.
  if (!loading && reviews.length === 0) return null;

  return (
    <section className="section reviews reveal" ref={revealRef}>
      <Box className="reviews-head">
        <span className="eyebrow">Customer love</span>
        <Box className="section-title">
          What Our <em>Beauty Queens</em> Say
        </Box>
        <p className="reviews-sub">
          Real words from real customers — no scripts, no stock photos.
        </p>
      </Box>
      {reviews.length !== 0 ? (
        <Box className="review-grid">
          {reviews.map((review) => {
            const product = review.productData?.[0];
            return (
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
                  {product ? (
                    <Box className="review-product">
                      {product.productBrand} {product.productName}
                    </Box>
                  ) : null}
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : loading ? (
        <ReviewGridSkeleton count={6} />
      ) : (
        <Box className="review-empty">No reviews yet — check back soon.</Box>
      )}
      <Box className="reviews-foot">
        <a
          href="https://t.me/k_glow_secret"
          target="_blank"
          rel="noopener noreferrer"
          className="section-link reviews-channel-link"
        >
          View all reviews in our Telegram channel →
        </a>
      </Box>
    </section>
  );
}
