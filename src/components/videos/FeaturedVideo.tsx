"use client";

import { useState } from "react";
import { formatVideoDate, type YoutubeVideo } from "@/lib/youtube";
import { VideoThumb } from "./VideoThumb";
import { VideoPlayButton } from "./VideoPlayButton";

type FeaturedVideoProps = {
  video: YoutubeVideo;
};

export function FeaturedVideo({ video }: FeaturedVideoProps) {
  const [playing, setPlaying] = useState(false);
  const date = formatVideoDate(video.publishedAt);

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
          <>
            <div
              className="video-featured-hit"
              onClick={() => setPlaying(true)}
            >
              <VideoThumb
                video={video}
                alt=""
                sizes="(max-width: 1023px) 100vw, 64vw"
                priority
              />
              <span className="video-media-overlay" aria-hidden />
            </div>
            <VideoPlayButton
              size="featured"
              as="button"
              label={`Reproduzir: ${video.title}`}
              onClick={() => setPlaying(true)}
            />
            <span className="video-badge-latest">Vídeo mais recente</span>
            {video.isShort ? <span className="video-chip">Short</span> : null}
          </>
        )}
      </div>

      <div className="video-featured-copy">
        <h3 className="video-featured-title">{video.title}</h3>
        <p className="video-meta">
          <span>{video.isShort ? "Short" : "Vídeo"}</span>
          {date ? <span aria-hidden>·</span> : null}
          {date ? <time dateTime={video.publishedAt}>{date}</time> : null}
        </p>
      </div>
    </article>
  );
}
