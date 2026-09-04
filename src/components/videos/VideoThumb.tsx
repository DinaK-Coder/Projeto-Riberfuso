"use client";

import Image from "next/image";
import { useState } from "react";
import {
  YOUTUBE_THUMB_QUALITIES,
  youtubeThumbUrl,
  type YoutubeVideo,
} from "@/lib/youtube";

type VideoThumbProps = {
  video: YoutubeVideo;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export function VideoThumb({
  video,
  alt,
  sizes,
  priority = false,
  className = "",
}: VideoThumbProps) {
  const [level, setLevel] = useState(0);
  const [failed, setFailed] = useState(false);
  const quality = YOUTUBE_THUMB_QUALITIES[level] ?? "hqdefault";
  const src = youtubeThumbUrl(video.id, quality);

  const bump = () => {
    setLevel((current) => {
      if (current >= YOUTUBE_THUMB_QUALITIES.length - 1) {
        setFailed(true);
        return current;
      }
      return current + 1;
    });
  };

  return (
    <span
      className={`video-thumb ${video.isShort ? "is-short" : ""} ${className}`.trim()}
    >
      {failed ? (
        <span className="video-thumb-empty">Capa indisponível</span>
      ) : (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="video-thumb-photo"
          onError={bump}
          onLoad={(event) => {
            if (event.currentTarget.naturalWidth <= 120) bump();
          }}
        />
      )}
    </span>
  );
}
