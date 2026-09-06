import { Announcement } from "../../lib/config";

/**
 * One-line strip above the navbar. Purely presentational — the copy lives in
 * lib/config.ts. Two spans carry the long and short wording; CSS shows one or
 * the other depending on the viewport width, so nothing re-renders on resize.
 */
export function AnnouncementBar() {
  return (
    <div className="announcement" role="note">
      <span className="announcement-full">{Announcement.full}</span>
      <span className="announcement-short">{Announcement.short}</span>
    </div>
  );
}
