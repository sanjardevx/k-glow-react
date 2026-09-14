/**
 * Loads YouTube's IFrame Player API once, lazily — only the first time a
 * Short is actually played, not on every visit to the page (mirrors the
 * click-to-play philosophy of the rest of this page).
 */
let apiPromise: Promise<void> | null = null;

export function withYouTubeApi(callback: () => void) {
  const w = window as any;
  if (w.YT && w.YT.Player) {
    callback();
    return;
  }
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const previousReady = w.onYouTubeIframeAPIReady;
      w.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        resolve();
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    });
  }
  apiPromise.then(callback);
}
