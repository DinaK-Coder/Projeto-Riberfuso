import { Suspense } from "react";
import { getYoutubeVideos } from "@/lib/youtube-feed";
import { youtubeChannel, type YoutubeVideo } from "@/lib/youtube";
import { FeaturedVideo } from "./FeaturedVideo";
import { VideoCard } from "./VideoCard";
import { VideosMotion } from "./VideosMotion";

function pickFeatured(videos: YoutubeVideo[]) {
  return videos.find((video) => !video.isShort) ?? videos[0] ?? null;
}

function VideosSkeleton() {
  return (
    <div className="videos-stage" aria-hidden>
      <div className="video-featured">
        <div className="video-featured-frame video-skeleton" />
        <div className="video-featured-copy">
          <div className="video-skeleton-line video-skeleton-line-sm" />
          <div className="video-skeleton-line" />
        </div>
      </div>
      <div className="videos-side">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="video-card video-card-skeleton">
            <div className="video-card-media video-skeleton" />
            <div className="video-card-body">
              <div className="video-skeleton-line" />
              <div className="video-skeleton-line video-skeleton-line-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function VideosContent() {
  const videos = await getYoutubeVideos(4);
  const featured = pickFeatured(videos);
  const rest = featured
    ? videos.filter((video) => video.id !== featured.id).slice(0, 3)
    : [];

  if (!featured) {
    return (
      <p className="videos-empty" role="status">
        Os vídeos do canal não puderam ser carregados agora. Use o botão acima
        para abrir o YouTube.
      </p>
    );
  }

  return (
    <VideosMotion>
      <div className="videos-stage">
        <FeaturedVideo video={featured} />
        <div className="videos-side" aria-label="Vídeos recentes">
          {rest.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </VideosMotion>
  );
}

export function Videos() {
  return (
    <section
      id="novidades"
      aria-labelledby="videos-heading"
      className="section-atmosphere section-atmosphere-steel section-divider-top bg-steel px-6 py-20 sm:px-10 lg:px-16 lg:py-24"
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="videos-intro">
          <div className="videos-intro-copy">
            <p className="font-body text-kicker text-signal uppercase">
              YouTube · {youtubeChannel.name}
            </p>
            <h2
              id="videos-heading"
              className="font-display text-display-lg mt-3 text-ice uppercase"
            >
              Novidades no canal
            </h2>
            <p className="videos-intro-lead">
              Dicas, pedidos da loja e lançamentos de ferramentas. Os vídeos mais
              recentes de {youtubeChannel.handle} entram aqui automaticamente.
            </p>
          </div>
          <a
            href={youtubeChannel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="videos-channel-cta"
          >
            Ver canal
            <span aria-hidden> →</span>
          </a>
        </div>

        <Suspense fallback={<VideosSkeleton />}>
          <VideosContent />
        </Suspense>
      </div>
    </section>
  );
}