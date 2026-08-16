import { Box } from "@mui/material";

export function Statistics() {
  return (
    <section className="stats">
      <Box className="stats-grid">
        <Box className="stat-tile">
          <Box className="stat-num">15+</Box>
          <Box className="stat-label">Brands carried</Box>
        </Box>
        <Box className="stat-tile">
          <Box className="stat-num">250+</Box>
          <Box className="stat-label">Products</Box>
        </Box>
        <Box className="stat-tile">
          <Box className="stat-num">1000+</Box>
          <Box className="stat-label">Happy customers</Box>
        </Box>
        <Box className="stat-tile">
          <Box className="stat-num">3</Box>
          <Box className="stat-label">Years in business</Box>
        </Box>
      </Box>
    </section>
  );
}
