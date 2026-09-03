export type YoutubeVideo = {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  thumbnail: string;
  isShort: boolean;
};

export type YoutubeThumbQuality = "maxresdefault" | "sddefault" | "hqdefault";

export const YOUTUBE_THUMB_QUALITIES: YoutubeThumbQuality[] = [
  "maxresdefault",
  "sddefault",
  "hqdefault",
];

export const youtubeChannel = {
  name: "Manual das Ferramentas",
  handle: "@manualdasferramentas",
  url: "https://www.youtube.com/@manualdasferramentas",
  channelId: "UCIsHXYiuceepeb4niztGzHQ",
} as const;

export const youtubeFeedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${youtubeChannel.channelId}`;

export function youtubeWatchUrl(videoId: string, isShort = false) {
  return isShort
    ? `https://www.youtube.com/shorts/${videoId}`
    : `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeThumbUrl(
  videoId: string,
  quality: YoutubeThumbQuality = "maxresdefault",
) {
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

export function youtubeThumbnail(videoId: string) {
  return youtubeThumbUrl(videoId, "maxresdefault");
}

export function formatVideoDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}
