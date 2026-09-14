import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { ExternalLinkIcon, PlayIcon } from "../../components/icons";
import TutorialService from "../../services/TutorialService";
import { TutorialPlatform } from "../../../lib/enums/tutorial.enum";
import type { Tutorial } from "../../../lib/types/tutorial";
import "../../../css/tutorials.css";

const TUTORIAL_LIMIT = 24;

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
    const autoplay = playing ? "autoplay=1&" : "";
    return (
      <iframe
        src={`https://www.youtube.com/embed/${tutorial.tutorialEmbedId}?${autoplay}rel=0&modestbranding=1&iv_load_policy=3`}
        title={tutorial.tutorialTitle}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
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
