/**
 * One placeholder for every image that fails to load.
 *
 * Product, cart and order photos come from the API's uploads folder, and a
 * file that went missing there used to leave the browser's broken-image icon
 * with the alt text spilling across the card. A single capturing listener on
 * the document catches every <img> on every page — no component has to
 * remember an onError — and swaps in a soft bottle outline on the image-well
 * colour, so a missing photo reads as "no photo" rather than "broken shop".
 *
 * The SVG is inline (no request that could fail in turn) and uses the token
 * values directly: --kg-sand for the well, --kg-ink-faint for the outline.
 */
const PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">' +
      '<rect width="400" height="400" fill="#f4eee7"/>' +
      '<g fill="none" stroke="#9c8b9c" stroke-width="6" stroke-linejoin="round" opacity=".55">' +
      '<rect x="172" y="112" width="56" height="34" rx="6"/>' +
      '<path d="M160 146h80l12 28v104a14 14 0 0 1-14 14h-76a14 14 0 0 1-14-14V174z"/>' +
      '<path d="M148 206h104"/>' +
      "</g></svg>",
  );

export function installImageFallback() {
  document.addEventListener(
    "error",
    (event) => {
      const img = event.target;
      if (!(img instanceof HTMLImageElement)) return;
      // Once only: if the placeholder itself ever failed, stop there.
      if (img.dataset.fallback) return;
      img.dataset.fallback = "true";
      img.srcset = "";
      img.src = PLACEHOLDER;
    },
    // `error` doesn't bubble, so it's caught on the way down instead.
    true,
  );
}
