import { Box } from "@mui/material";

const reviews = [
  {
    stars: 5,
    product: "Anua Cleanser & Serum",
    imagePath: "/img/reviews/review-1.jpeg",
    reviewer: "Tasdiqlangan xaridor",
  },
  {
    stars: 5,
    product: "Centella Skincare Set",
    imagePath: "/img/reviews/review-2.jpeg",
    reviewer: "Tasdiqlangan xaridor",
  },
  {
    stars: 5,
    product: "K-Glow Unboxing",
    imagePath: "/img/reviews/review-3.jpeg",
    reviewer: "Tasdiqlangan xaridor",
  },
];

export function Reviews() {
  return (
    <section className="section reviews">
      <Box className="reviews-head">
        <span className="reviews-badge">❝ Customer Love</span>
        <Box className="section-title">
          What Our <em>Beauty Queens</em> Say
        </Box>
        <p className="reviews-sub">
          Real screenshots from real customers — no scripts, no stock photos.
        </p>
      </Box>
      <Box className="review-grid">
        {reviews.map((ele, index) => (
          <Box className="review-card" key={index}>
            <Box className="review-stars">
              <span className="star">{"★".repeat(ele.stars)}</span>
              {ele.stars < 5 ? (
                <span className="star empty">{"★".repeat(5 - ele.stars)}</span>
              ) : null}
            </Box>
            <Box className="review-shot">
              <img src={ele.imagePath} alt={`${ele.product} review`} />
            </Box>
            <Box className="review-product">{ele.product}</Box>
            <Box className="verified">
              <span className="verified-dot">✓</span>
              {ele.reviewer}
            </Box>
          </Box>
        ))}
      </Box>
    </section>
  );
}
