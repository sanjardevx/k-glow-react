import type { ReactNode } from "react";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { TELEGRAM_URL } from "../../../lib/config";
import { BoltIcon, CheckIcon, SearchIcon } from "../../components/icons";
import { useI18n, type TKey } from "../../../lib/i18n";
import { rich } from "../../../lib/i18n/rich";
import "../../../css/ai-beauty.css";

/**
 * Placeholder page for a feature that isn't built yet. The navbar and footer
 * have carried an "AI Beauty" label since the design was approved; this gives
 * that label somewhere honest to land instead of an inert link — it says
 * plainly that it's coming, and sends people to the shop meanwhile.
 */
const planned: { icon: ReactNode; title: TKey; text: TKey }[] = [
  { icon: <SearchIcon />, title: "ai.skinTitle", text: "ai.skinText" },
  { icon: <BoltIcon />, title: "ai.routineTitle", text: "ai.routineText" },
  { icon: <CheckIcon />, title: "ai.realTitle", text: "ai.realText" },
];

export function AiBeautyPage() {
  const { t } = useI18n();
  return (
    <div className="ai-page">
      <Box className="ai-hero">
        <span className="eyebrow">{t("ai.eyebrow")}</span>
        <h1 className="ai-title">{rich(t("ai.title"))}</h1>
        <p className="ai-sub">{t("ai.sub")}</p>
        <span className="ai-badge">{t("ai.badge")}</span>
      </Box>

      <div className="ai-cards">
        {planned.map((item) => (
          <Box className="ai-card" key={item.title}>
            <span className="ai-card-icon">{item.icon}</span>
            <h3 className="ai-card-title">{t(item.title)}</h3>
            <p className="ai-card-text">{t(item.text)}</p>
          </Box>
        ))}
      </div>

      <Box className="ai-cta">
        <p className="ai-cta-text">{t("ai.ctaText")}</p>
        <Box className="ai-cta-actions">
          <a
            className="ai-cta-primary"
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("footer.join")}
          </a>
          <Link className="ai-cta-secondary" to="/products">
            {t("ai.shop")}
          </Link>
        </Box>
      </Box>
    </div>
  );
}
