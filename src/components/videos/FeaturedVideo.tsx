"use client";

import { useState } from "react";
import { formatVideoDate, type YoutubeVideo } from "@/lib/youtube";
import { VideoThumb } from "./VideoThumb";

type FeaturedVideoProps = {
  video: YoutubeVideo;
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="video-play-icon" aria-hidden>
      <path d="M8.6 6.2v11.6L19.2 12 8.6 6.2z" />
    </svg>
  );
}

export function FeaturedVideo({ video }: FeaturedVideoProps) {
  const [playing, setPlaying] = useState(false);
  const date = formatVideoDate(video.publishedAt);
  const kind = video.isShort ? "Short" : "Vídeo mais recente";

  return (
    <article className="video-featured" data-videos-rise>
      <div className="video-featured-frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="video-featured-iframe"
          />
        ) : (
          <button
            type="button"
            className="video-featured-play"
            onClick={() => setPlaying(true)}
            aria-label={`Reproduzir: ${video.title}`}
          >
            <VideoThumb
              video={video}
              alt={video.title}
              sizes="(max-width: 1023px) 100vw, 64vw"
              priority
            />
            <span className="video-featured-shade" aria-hidden />
            <span className="video-play-badge">
              <PlayIcon />
            </span>
            {video.isShort ? (
              <span className="video-chip video-chip-featured">Short</span>
            ) : null}
          </button>
        )}
      </div>

      <div className="video-featured-copy">
        <p className="video-meta">
          <span>{kind}</span>
          {date ? <span aria-hidden>·</span> : null}
          {date ? <time dateTime={video.publishedAt}>{date}</time> : null}
        </p>
        <h3 className="video-featured-title">{video.title}</h3>
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="video-watch-link"
        >
          Assistir no YouTube
          <span aria-hidden> →</span>
        </a>
      </div>
    </article>
  );
}