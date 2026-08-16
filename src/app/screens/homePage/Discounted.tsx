import { Box } from "@mui/material";

const CDN =
  "https://www.caretobeauty.com/cdn-cgi/image/w=600,h=600,sharpen=1,f=auto/media/catalog/product/";

const list = [
  {
    productBrand: "Torriden",
    productName: "Dive-In Serum",
    productPrice: "96,000 so'm",
    productOldPrice: "120,000",
    productDiscount: 20,
    stars: 4,
    reviews: 51,
    imagePath: CDN + "t/o/torriden-dive-in-serum-50ml.jpg",
  },
  {
    productBrand: "VT Cosmetics",
    productName: "Reedle Shot 100",
    productPrice: "153,000 so'm",
    productOldPrice: "180,000",
    productDiscount: 15,
    stars: 4,
    reviews: 39,
    imagePath: CDN + "v/t/vt-cosmetics-cica-reedle-shot-100-essence-50ml.jpg",
  },
  {
    productBrand: "Biodance",
    productName: "Bio-Collagen Mask",
    productPrice: "84,000 so'm",
    productOldPrice: "120,000",
    productDiscount: 30,
    stars: 5,
    reviews: 167,
    imagePath: CDN + "b/i/biodance-bio-collagen-real-deep-mask-34g_1.jpg",
  },
  {
    productBrand: "Round Lab",
    productName: "Dokdo Toner",
    productPrice: "99,000 so'm",
    productOldPrice: "110,000",
    productDiscount: 10,
    stars: 4,
    reviews: 28,
    imagePath: CDN + "r/o/round-lab-1025-dokdo-toner-100ml_1.png",
  },
];

export function Discounted() {
  return (
    <section className="section">
      <Box className="section-inner">
        <Box className="section-head">
          <Box className="section-title">
            Discounted <em>picks</em>
          </Box>
          <span className="section-link">View all →</span>
        </Box>
        <Box className="product-grid">
          {list.map((ele, index) => {
            return (
              <Box className="p-card" key={index}>
                <Box className="p-photo">
                  <span className="p-badge sale">−{ele.productDiscount}%</span>
                  <img src={ele.imagePath} alt={ele.productName} />
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
                    <span className="p-price-old">{ele.productOldPrice}</span>
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
