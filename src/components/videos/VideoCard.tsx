import { formatVideoDate, type YoutubeVideo } from "@/lib/youtube";
import { VideoThumb } from "./VideoThumb";

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
      className="video-card"
      data-videos-rise
      aria-label={`${video.title}${date ? `. Publicado em ${date}` : ""}`}
    >
      <span className="video-card-media">
        <VideoThumb
          video={video}
          alt={video.title}
          sizes="(max-width: 767px) 78vw, (max-width: 1023px) 46vw, 22vw"
        />
        {video.isShort ? <span className="video-chip">Short</span> : null}
      </span>
      <span className="video-card-body">
        <span className="video-card-title">{video.title}</span>
        {date ? (
          <time className="video-card-date" dateTime={video.publishedAt}>
            {date}
          </time>
        ) : null}
      </span>
    </a>
  );
}