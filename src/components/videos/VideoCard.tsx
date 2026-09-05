import { formatVideoDate, type YoutubeVideo } from "@/lib/youtube";
import { VideoThumb } from "./VideoThumb";
import { VideoPlayButton } from "./VideoPlayButton";

type VideoCardProps = {
  video: YoutubeVideo;
};

export function VideoCard({ video }: VideoCardProps) {
  const date = formatVideoDate(video.publishedAt);

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`video-card${video.isShort ? " is-short" : ""}`}
      data-videos-rise
      aria-label={`Reproduzir: ${video.title}${video.isShort ? ", Short" : ""}${date ? `. Publicado em ${date}` : ""}`}
    >
      <span className="video-card-media">
        <VideoThumb
          video={video}
          alt=""
          sizes="(max-width: 639px) 46vw, (max-width: 1023px) 30vw, 18vw"
        />
        <span className="video-media-overlay" aria-hidden />
        <VideoPlayButton
          size="card"
          label={`Reproduzir: ${video.title}`}
        />
        {video.isShort ? <span className="video-chip">Short</span> : null}
      </span>
      <span className="video-card-body">
        <span className="video-card-title">{video.title}</span>
        <span className="video-card-meta">
          <span>{video.isShort ? "Short" : "Vídeo"}</span>
          {date ? (
            <>
              <span aria-hidden>·</span>
              <time dateTime={video.publishedAt}>{date}</time>
            </>
          ) : null}
        </span>
      </span>
    </a>
  );
}
