import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { ExternalLinkIcon, PlayIcon } from "../../components/icons";
import TutorialService from "../../services/TutorialService";
import { TutorialPlatform } from "../../../lib/enums/tutorial.enum";
import type { Tutorial } from "../../../lib/types/tutorial";
import { withYouTubeApi } from "./youtubeApi";
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

  return (
    <div className="tutorials-page">
      <Box className="tutorials-head">
        <span className="eyebrow">Watch and learn</span>
        <h1 className="tutorials-title">
          Live <em>tutorials</em>
        </h1>
        <p className="tutorials-sub">
          Short routines and product how-tos — so you know exactly what to do
          with everything in your bag.
        </p>
      </Box>

      {loading ? (
        <Box className="tutorials-note">Loading tutorials…</Box>
      ) : failed ? (
        <Box className="tutorials-note">
          We couldn't load the tutorials just now — please try again in a
          moment.
        </Box>
      ) : tutorials.length === 0 ? (
        <Box className="tutorials-note">
          No tutorials yet — check back soon.
        </Box>
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
              </Box>
              <Box className="t-title">{tutorial.tutorialTitle}</Box>
            </Box>
          ))}
        </div>
      )}
    </div>
  );
}

interface TutorialEmbedProps {
  tutorial: Tutorial;
  playing: boolean;
  onPlay: () => void;
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
function TutorialEmbed({ tutorial, playing, onPlay }: TutorialEmbedProps) {
  const isYouTube = tutorial.tutorialPlatform === TutorialPlatform.YOUTUBE;

  if (isYouTube && (playing || !tutorial.tutorialThumbnail)) {
    return (
      <YouTubeShortPlayer
        embedId={tutorial.tutorialEmbedId}
        title={tutorial.tutorialTitle}
        autoplay={playing}
      />
    );
  }

  if (isYouTube) {
    return (
      <button
        type="button"
        className="t-play"
        onClick={onPlay}
        aria-label={`Play ${tutorial.tutorialTitle}`}
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
      <span className="t-play-out-label">Watch on Instagram</span>
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
function YouTubeShortPlayer({ embedId, title, autoplay }: YouTubeShortPlayerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [playing, setPlaying] = useState(autoplay);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);

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
        aria-label="Play/Pause"
        onClick={togglePlayPause}
      />
      <div className={`t-yt-volume-wrap${volumeOpen ? " open" : ""}`}>
        <button
          type="button"
          className="t-yt-mute"
          aria-label="Volume"
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
          aria-label={`Volume for ${title}`}
          onChange={handleVolumeInput}
          onMouseUp={() => setVolumeOpen(false)}
          onTouchEnd={() => setVolumeOpen(false)}
        />
      </div>
      <div className="t-yt-bottom-controls">
        <button
          type="button"
          className="t-yt-playpause"
          aria-label="Play/Pause"
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
