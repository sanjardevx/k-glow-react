import { Box } from "@mui/material";

const CDN =
  "https://www.caretobeauty.com/cdn-cgi/image/w=600,h=600,sharpen=1,f=auto/media/catalog/product/";

const list = [
  {
    productBrand: "COSRX",
    productName: "Advanced Snail 96 Mucin Power Essence",
    productPrice: "165,000 so'm",
    productViews: 1240,
    stars: 4,
    reviews: 128,
    imagePath:
      CDN + "c/o/cosrx-advanced-snail-96-mucin-power-essence-100ml.jpg",
  },
  {
    productBrand: "Beauty of Joseon",
    productName: "Glow Serum Propolis + Niacinamide",
    productPrice: "142,000 so'm",
    productViews: 980,
    stars: 5,
    reviews: 94,
    imagePath:
      CDN + "b/e/beauty-of-joseon-glow-serum-propolis-niacinamide-30ml.jpg",
  },
  {
    productBrand: "Anua",
    productName: "Heartleaf Pore Control Cleansing Oil",
    productPrice: "128,000 so'm",
    productViews: 870,
    stars: 4,
    reviews: 76,
    imagePath: CDN + "a/n/anua-heartleaf-pore-control-cleansing-oil-200ml.jpg",
  },
  {
    productBrand: "rom&nd",
    productName: "Juicy Lasting Tint",
    productPrice: "98,000 so'm",
    productViews: 1510,
    stars: 5,
    reviews: 203,
    imagePath:
      CDN + "r/o/romand-the-juicy-lasting-tint-07-cherry-bomb-3-5g_1.jpg",
  },
];

export function Bestsellers() {
  const bestsellers = [...list].sort((a, b) => b.productViews - a.productViews);

  return (
    <section className="section">
      <Box className="section-inner">
        <Box className="section-head">
          <Box className="section-title">
            Best<em>sellers</em>
          </Box>
          <span className="section-link">View all →</span>
        </Box>
        <Box className="product-grid">
          {bestsellers.map((ele, index) => {
            return (
              <Box className="p-card" key={index}>
                <Box className="p-photo">
                  <span className="p-badge top">TOP</span>
                  <Box className="p-photo-frame">
                    <img src={ele.imagePath} alt={ele.productName} />
                  </Box>
                </Box>
                <Box className="p-body">
                  <Box className="p-brand">{ele.productBrand}</Box>
                  <Box className="p-name">{ele.productName}</Box>
                  <Box className="p-stars">
                    <span className="star">{"★".repeat(ele.stars)}</span>
                    {ele.stars < 5 ? (
                      <span className="star empty">
                        {"★".repeat(5 - ele.stars)}
                      </span>
                    ) : null}
                    <span>({ele.reviews})</span>
                  </Box>
                  <Box className="p-price-row">
                    <span className="p-price">{ele.productPrice}</span>
                  </Box>
                  <Box className="p-quickadd">Quick Add</Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </section>
  );
}
