import { Box } from "@mui/material";

const brands = [
  { name: "Round Lab", logo: "/img/brands/round-lab-logo.webp" },
  { name: "Beauty of Joseon", logo: "/img/brands/joseon-logo.webp" },
  { name: "COSRX", logo: "/img/brands/cosrx-logo.webp" },
  { name: "LAGOM", logo: "/img/brands/lagom-logo.webp" },
  { name: "Torriden", logo: "/img/brands/torriden-logo.webp" },
  { name: "Anua", logo: "/img/brands/anua-logo.webp" },
  { name: "Biodance", logo: "/img/brands/biodance-logo.webp" },
  { name: "VT Cosmetics", logo: "/img/brands/vt-cosmetics-logo.webp" },
  { name: "rom&nd", logo: "/img/brands/romand-logo.webp" },
];

export function Brands() {
  return (
    <section className="section brands">
      <Box className="section-inner">
        <Box className="brands-head">
          <span className="reviews-badge">✦ Authentic Only</span>
          <Box className="section-title">
            Brands We <em>Carry</em>
          </Box>
        </Box>
      </Box>
      <Box className="brand-marquee">
        <Box className="brand-track">
          {[...brands, ...brands].map((ele, index) => (
            <Box
              className={`brand-tile${index >= brands.length ? " dup" : ""}`}
              key={index}
              aria-hidden={index >= brands.length}
            >
              <Box className="brand-logo">
                <img src={ele.logo} alt={ele.name} />
              </Box>
              <span className="brand-name">{ele.name}</span>
            </Box>
          ))}
        </Box>
      </Box>
    </section>
  );
}
