import { useEffect, useRef, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import { useActiveSlide } from "./useActiveSlide";
import { ExternalLinkIcon, PlayIcon } from "../../components/icons";
import TutorialService from "../../services/TutorialService";
import { finalPrice, formatPrice } from "../productsPage/productsData";
import { serverApi } from "../../../lib/config";
import { TutorialPlatform } from "../../../lib/enums/tutorial.enum";
import type { Tutorial } from "../../../lib/types/tutorial";
import { withYouTubeApi } from "./youtubeApi";
import { LoadingNote } from "../../components/Loaders";
import { useI18n } from "../../../lib/i18n";
import { rich } from "../../../lib/i18n/rich";
import "../../../css/tutorials.css";

const TUTORIAL_LIMIT = 24;
// Matches the site's own 860px breakpoint (tutorials.css) — below this the
// player's volume slider gives way to a plain mute toggle.
const MOBILE_BREAKPOINT = 860;

/**
 * Live Tutorials — short K-beauty how-tos the shop curates. Nothing is
 * hosted here: each card embeds the original YouTube Short.
 *
 * The player is only mounted once a card is actually played (`playingId`),
 * which keeps a page of a dozen reels from loading a dozen iframes up front
 * and, as a side effect, keeps YouTube's title/channel chrome off the page
 * until the visitor has chosen to watch.
 *
 * No scroll-reveal on the grid, unlike the homepage sections: useReveal
 * attaches its observer on mount, and this grid only mounts once the fetch
 * resolves — the observer would never see it and the grid would sit at
 * opacity 0 forever.
 */
export function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const { t } = useI18n();
  // noSsr makes this evaluate synchronously on mount — without it the first
  // render always reports "not mobile" and a phone would flash the grid
  // before swapping to the feed.
  const isPhone = useMediaQuery(`(max-width:${MOBILE_BREAKPOINT}px)`, {
    noSsr: true,
  });

  useEffect(() => {
    const tutorialService = new TutorialService();
    tutorialService
      .getTutorials(TUTORIAL_LIMIT)
      .then((data) => setTutorials(data))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  function handlePlay(tutorial: Tutorial) {
    setPlayingId(tutorial._id);
    new TutorialService().countView(tutorial._id);
  }

  // The feed owns the whole screen below the header, so the page heading
  // would only push it out of view — the phone layout drops it.
  const showHeading = !isPhone || loading || failed || tutorials.length === 0;

  return (
    <div className="tutorials-page">
      {showHeading ? (
        <Box className="tutorials-head">
          <span className="eyebrow">{t("tut.eyebrow")}</span>
          <h1 className="tutorials-title">{rich(t("tut.title"))}</h1>
          <p className="tutorials-sub">{t("tut.sub")}</p>
        </Box>
      ) : null}

      {loading ? (
        <Box className="tutorials-note">
          <LoadingNote>{t("load.tutorials")}</LoadingNote>
        </Box>
      ) : failed ? (
        <Box className="tutorials-note">{t("tut.failed")}</Box>
      ) : tutorials.length === 0 ? (
        <Box className="tutorials-note">{t("tut.empty")}</Box>
      ) : isPhone ? (
        <TutorialsFeed tutorials={tutorials} />
      ) : (
        <div className="tutorials-grid">
          {tutorials.map((tutorial) => (
            <Box className="t-card" key={tutorial._id}>
              <Box className="t-embed">
                <TutorialEmbed
                  tutorial={tutorial}
                  playing={playingId === tutorial._id}
                  onPlay={() => handlePlay(tutorial)}
                />
                <TutorialShopBar
                  tutorial={tutorial}
                  playing={playingId === tutorial._id}
                />
              </Box>
              <Box className="t-title">{tutorial.tutorialTitle}</Box>
            </Box>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * The phone layout: one Short per screen, snapped, swiped like the app it
 * borrows from. A grid of 9:16 cards two-across leaves each video too small
 * to actually watch, which is what this replaces below MOBILE_BREAKPOINT.
 *
 * Only the slide currently on screen mounts a player; the rest stay as
 * still thumbnails. That keeps one iframe alive at a time instead of a
 * dozen, and means swiping away from a Short stops it without having to
 * reach into YouTube's API to pause it — the component simply unmounts.
 *
 * While it is open the page itself must not scroll: the feed is its own
 * scroller, and a second scrollable surface behind it (the announcement
 * bar and footer sticking out past one viewport) would fight every swipe.
 * `body.t-feed-lock` handles that, plus hides the chrome that would
 * otherwise sit over the video — see app.css.
 */
function TutorialsFeed({ tutorials }: { tutorials: Tutorial[] }) {
  const { containerRef, activeIndex } = useActiveSlide<HTMLDivElement>(
    tutorials.length,
  );
  const [muted, setMuted] = useState(true);
  const countedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Both elements — see app.css: hiding overflow on <body> alone leaves
    // <html> free to scroll.
    document.body.classList.add("t-feed-lock");
    document.documentElement.classList.add("t-feed-lock");

    // The sticky header's height isn't a constant — it wraps to two rows on
    // a phone and the row heights follow the font — so it's measured rather
    // than hard-coded, and re-measured when the viewport changes (rotation,
    // or the keyboard opening and closing).
    function measureNav() {
      const nav = document.querySelector(".nav");
      const height = nav ? Math.round(nav.getBoundingClientRect().height) : 0;
      document.documentElement.style.setProperty("--t-nav", `${height}px`);
    }
    measureNav();
    window.addEventListener("resize", measureNav);
    window.addEventListener("orientationchange", measureNav);

    return () => {
      document.body.classList.remove("t-feed-lock");
      document.documentElement.classList.remove("t-feed-lock");
      document.documentElement.style.removeProperty("--t-nav");
      window.removeEventListener("resize", measureNav);
      window.removeEventListener("orientationchange", measureNav);
    };
  }, []);

  /** The feed has no "press play", so a view is counted when a Short
   *  becomes the one on screen — once per visit, not on every swipe back. */
  useEffect(() => {
    const active = tutorials[activeIndex];
    if (!active || countedRef.current.has(active._id)) return;
    countedRef.current.add(active._id);
    new TutorialService().countView(active._id);
  }, [activeIndex, tutorials]);

  /** A slide that isn't the active one still shows its thumbnail and play
   *  button. Tapping that shouldn't do nothing — it scrolls the slide into
   *  place, and being the active slide is what starts it playing. */
  function focusSlide(index: number) {
    const container = containerRef.current;
    const slide = container?.querySelector<HTMLElement>(
      `[data-slide="${index}"]`,
    );
    if (!slide) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    slide.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <div className="t-feed" ref={containerRef}>
      {tutorials.map((tutorial, index) => (
        <section className="t-slide" key={tutorial._id} data-slide={index}>
          <div className="t-slide-media">
            <TutorialEmbed
              tutorial={tutorial}
              playing={index === activeIndex}
              onPlay={() => focusSlide(index)}
              startMuted={muted}
              onMutedChange={setMuted}
            />
            <TutorialShopBar tutorial={tutorial} playing={index === activeIndex} />
          </div>
          <p className="t-slide-title">{tutorial.tutorialTitle}</p>
        </section>
      ))}
    </div>
  );
}

/**
 * The shop bar pinned over the bottom of each video — the whole reason the
 * tutorials exist, commercially. It is deliberately always visible rather
 * than an end-card: most viewers never reach the end of a short (and these
 * loop, so there isn't really an "end"), and the urge to buy lands while
 * the product is on screen, not after. TikTok Shop and Reels ads pin the
 * same way.
 *
 * Two shapes: the exact product when the admin linked one, otherwise the
 * brand, which always exists and keeps working after a product sells out,
 * is deleted, or was never stocked.
 */
function TutorialShopBar({
  tutorial,
  playing,
}: {
  tutorial: Tutorial;
  playing: boolean;
}) {
  const { t } = useI18n();
  const product = tutorial.productData?.[0];
  // While a player is mounted it draws its own bar (play/pause + progress)
  // along the bottom edge, so the shop bar lifts clear of it. Driven by a
  // class rather than :has() so it doesn't depend on selector support.
  const className = `t-shop${playing ? " t-shop-lifted" : ""}`;

  if (product) {
    return (
      <Link to={`/products/${product._id}`} className={className}>
        <img
          src={`${serverApi}/${product.productImages[0]}`}
          alt=""
          className="t-shop-thumb"
        />
        <span className="t-shop-text">
          <span className="t-shop-name">{product.productName}</span>
          <span className="t-shop-price">
            {formatPrice(finalPrice(product))}
          </span>
        </span>
        <span className="t-shop-go" aria-hidden="true">
          ›
        </span>
      </Link>
    );
  }

  if (!tutorial.tutorialBrand) return null;

  return (
    <Link
      to={`/products?search=${encodeURIComponent(tutorial.tutorialBrand)}`}
      className={className}
    >
      <span className="t-shop-text">
        <span className="t-shop-name">
          {t("tut.shopBrand", { brand: tutorial.tutorialBrand })}
        </span>
      </span>
      <span className="t-shop-go" aria-hidden="true">
        ›
      </span>
    </Link>
  );
}

interface TutorialEmbedProps {
  tutorial: Tutorial;
  playing: boolean;
  onPlay: () => void;
  startMuted?: boolean;
  onMutedChange?: (muted: boolean) => void;
}

/**
 * Three shapes, in order of preference:
 *  - a YouTube Short we hold a thumbnail for → our own play button, which
 *    swaps in the real player on click;
 *  - the same without a thumbnail (its oEmbed lookup failed at upload) →
 *    the player straight away, since there is nothing to show instead;
 *  - Instagram → a card that opens the reel on Instagram. Meta's embed
 *    needs their script on the page and renders their own chrome around
 *    the post, neither of which belongs on the storefront.
 */
function TutorialEmbed({
  tutorial,
  playing,
  onPlay,
  startMuted,
  onMutedChange,
}: TutorialEmbedProps) {
  const { t } = useI18n();
  const isYouTube = tutorial.tutorialPlatform === TutorialPlatform.YOUTUBE;

  if (isYouTube && (playing || !tutorial.tutorialThumbnail)) {
    return (
      <YouTubeShortPlayer
        embedId={tutorial.tutorialEmbedId}
        title={tutorial.tutorialTitle}
        autoplay={playing}
        startMuted={startMuted}
        onMutedChange={onMutedChange}
      />
    );
  }

  if (isYouTube) {
    return (
      <button
        type="button"
        className="t-play"
        onClick={onPlay}
        aria-label={t("tut.play", { title: tutorial.tutorialTitle })}
      >
        <img src={tutorial.tutorialThumbnail} alt="" className="t-thumb" />
        <span className="t-play-icon">
          <PlayIcon />
        </span>
      </button>
    );
  }

  return (
    <a
      href={tutorial.tutorialUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="t-play t-play-out"
      onClick={onPlay}
    >
      <span className="t-play-icon">
        <ExternalLinkIcon />
      </span>
      <span className="t-play-out-label">{t("tut.instagram")}</span>
    </a>
  );
}

interface YouTubeShortPlayerProps {
  embedId: string;
  title: string;
  /** False only for the no-thumbnail fallback case, where the player
   * mounts immediately but shouldn't start itself — the visible play
   * button below is the only "click to watch" affordance left at that
   * point, since YouTube's own controls are hidden. */
  autoplay: boolean;
  /** The feed starts every Short muted, because browsers refuse to autoplay
   * audio before the visitor has interacted with the page. Once they unmute
   * one, `onMutedChange` lets the feed remember that for the next slide —
   * the tap counts as the gesture, so later Shorts can start with sound. */
  startMuted?: boolean;
  onMutedChange?: (muted: boolean) => void;
}

/**
 * Mounts the official YouTube IFrame Player API with `controls: 0`, which
 * hides ALL of YouTube's own UI (title overlay, play button, settings, CC)
 * in one shot, and drives playback with our own play/pause + volume +
 * progress bar instead — same approach as the admin's Tutorials page.
 *
 * Only one Short is ever "playing" at a time on this page already (the
 * parent tracks a single `playingId`), and switching to another card
 * unmounts this component — the cleanup effect below destroys the player,
 * so the previous video actually stops rather than playing on in the
 * background.
 */
function YouTubeShortPlayer({
  embedId,
  title,
  autoplay,
  startMuted,
  onMutedChange,
}: YouTubeShortPlayerProps) {
  const { t } = useI18n();
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [playing, setPlaying] = useState(autoplay);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(!!startMuted);

  useEffect(() => {
    let destroyed = false;
    let progressTimer: number | undefined;

    withYouTubeApi(() => {
      if (destroyed || !mountRef.current) return;
      const w = window as any;
      const player = new w.YT.Player(mountRef.current, {
        videoId: embedId,
        playerVars: {
          controls: 0,
          autoplay: autoplay ? 1 : 0,
          mute: startMuted ? 1 : 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          playsinline: 1,
          disablekb: 1,
          fs: 0,
        },
        events: {
          onReady: (e: any) => {
            if (autoplay) e.target.playVideo();
            progressTimer = window.setInterval(() => {
              const duration = player.getDuration ? player.getDuration() : 0;
              if (!duration) return;
              setProgress(player.getCurrentTime() / duration);
            }, 400);
          },
          onStateChange: (e: any) => {
            setPlaying(e.data === w.YT.PlayerState.PLAYING);
          },
        },
      });
      playerRef.current = player;
    });

    return () => {
      destroyed = true;
      if (progressTimer) window.clearInterval(progressTimer);
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedId]);

  function togglePlayPause() {
    const p = playerRef.current;
    if (!p) return;
    if (p.getPlayerState() === 1) p.pauseVideo();
    else p.playVideo();
  }

  function handleVolumeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const p = playerRef.current;
    if (!p) return;
    const volume = Number(e.target.value);
    p.setVolume(volume);
    if (volume === 0) p.mute();
    else p.unMute();
    setMuted(volume === 0);
    onMutedChange?.(volume === 0);
  }

  /** The fine-grained slider is desktop-only (hidden below MOBILE_BREAKPOINT
   * in CSS): iOS Safari ignores `setVolume()` on actual media volume — only
   * mute/unmute works there — and the physical volume buttons are what
   * visitors actually reach for on a phone anyway. So on mobile the mute
   * button just toggles mute directly instead of opening the slider. */
  function handleMuteClick() {
    if (window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches) {
      const p = playerRef.current;
      if (!p) return;
      const nowMuted = !p.isMuted();
      if (nowMuted) p.mute();
      else p.unMute();
      setMuted(nowMuted);
      onMutedChange?.(nowMuted);
      return;
    }
    setVolumeOpen((open) => !open);
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const p = playerRef.current;
    if (!p) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    p.seekTo(p.getDuration() * ratio, true);
  }

  return (
    <div className="t-yt-mount-wrap">
      <div ref={mountRef} className="t-yt-mount" />
      <button
        type="button"
        className="t-yt-tap-toggle"
        aria-label={t("tut.playPause")}
        onClick={togglePlayPause}
      />
      <div className={`t-yt-volume-wrap${volumeOpen ? " open" : ""}`}>
        <button
          type="button"
          className="t-yt-mute"
          aria-label={t("tut.volume")}
          onClick={handleMuteClick}
        >
          {muted ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3z" />
              <line x1="15" y1="9" x2="21" y2="15" stroke="currentColor" strokeWidth={2} />
              <line x1="21" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth={2} />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3z" />
            </svg>
          )}
        </button>
        <input
          type="range"
          className="t-yt-volume"
          min={0}
          max={100}
          defaultValue={100}
          aria-label={t("tut.volumeFor", { title })}
          onChange={handleVolumeInput}
          onMouseUp={() => setVolumeOpen(false)}
          onTouchEnd={() => setVolumeOpen(false)}
        />
      </div>
      <div className="t-yt-bottom-controls">
        <button
          type="button"
          className="t-yt-playpause"
          aria-label={t("tut.playPause")}
          onClick={togglePlayPause}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          )}
        </button>
        <div className="t-yt-progress" onClick={handleSeek}>
          <div className="t-yt-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
