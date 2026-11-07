import { useI18n } from "../../lib/i18n";

/**
 * One-line strip above the navbar. Purely presentational — the copy lives in
 * the dictionaries (announce.*); the delivery figure must match
 * FREE_DELIVERY_THRESHOLD in screens/cartPage/cartSelectors.ts. Two spans carry the long and short wording; CSS shows one or
 * the other depending on the viewport width, so nothing re-renders on resize.
 */
export function AnnouncementBar() {
  const { t } = useI18n();
  return (
    <div className="announcement" role="note">
      <span className="announcement-full">{t("announce.full")}</span>
      <span className="announcement-short">{t("announce.short")}</span>
    </div>
  );
}
