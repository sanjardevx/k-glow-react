import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { TELEGRAM_URL } from "../../../lib/config";
import { BoltIcon, CheckIcon, SearchIcon } from "../../components/icons";
import "../../../css/ai-beauty.css";

/**
 * Placeholder page for a feature that isn't built yet. The navbar and footer
 * have carried an "AI Beauty" label since the design was approved; this gives
 * that label somewhere honest to land instead of an inert link — it says
 * plainly that it's coming, and sends people to the shop meanwhile.
 */
const planned = [
  {
    icon: <SearchIcon />,
    title: "Skin check",
    text: "Answer a few questions about your skin and what bothers you most.",
  },
  {
    icon: <BoltIcon />,
    title: "Your routine",
    text: "Get a morning and night routine built around those answers.",
  },
  {
    icon: <CheckIcon />,
    title: "Real products",
    text: "Every step matched to something we actually keep in stock.",
  },
];

export function AiBeautyPage() {
  return (
    <div className="ai-page">
      <Box className="ai-hero">
        <span className="eyebrow">Coming soon</span>
        <h1 className="ai-title">
          AI <em>Beauty</em>
        </h1>
        <p className="ai-sub">
          A skin check that leads to a routine — not a list of everything we
          sell. We're building it now, and it will live right here.
        </p>
        <span className="ai-badge">In development</span>
      </Box>

      <div className="ai-cards">
        {planned.map((item) => (
          <Box className="ai-card" key={item.title}>
            <span className="ai-card-icon">{item.icon}</span>
            <h3 className="ai-card-title">{item.title}</h3>
            <p className="ai-card-text">{item.text}</p>
          </Box>
        ))}
      </div>

      <Box className="ai-cta">
        <p className="ai-cta-text">
          Want to hear the moment it's live? We announce everything on Telegram
          first.
        </p>
        <Box className="ai-cta-actions">
          <a
            className="ai-cta-primary"
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Join our Telegram →
          </a>
          <Link className="ai-cta-secondary" to="/products">
            Shop in the meantime
          </Link>
        </Box>
      </Box>
    </div>
  );
}
