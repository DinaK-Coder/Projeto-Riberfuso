import {
  youtubeFeedUrl,
  youtubeThumbnail,
  youtubeWatchUrl,
  type YoutubeVideo,
} from "./youtube";

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCharCode(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code)),
    )
    .trim();
}

function tagValue(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return match ? decodeXml(match[1]) : "";
}

function parseEntry(entry: string): YoutubeVideo | null {
  const id = tagValue(entry, "yt:videoId");
  if (!id) return null;

  const href =
    entry.match(/<link[^>]+href="([^"]+)"/)?.[1] ?? youtubeWatchUrl(id);
  const isShort = href.includes("/shorts/");

  return {
    id,
    title: tagValue(entry, "title") || "Vídeo no YouTube",
    url: href,
    publishedAt: tagValue(entry, "published"),
    thumbnail: youtubeThumbnail(id),
    isShort,
  };
}

export function parseYoutubeFeed(xml: string): YoutubeVideo[] {
  return xml
    .split("<entry>")
    .slice(1)
    .flatMap((chunk) => {
      const entry = chunk.split("</entry>")[0];
      const video = parseEntry(entry ?? "");
      return video ? [video] : [];
    });
}

export async function getYoutubeVideos(limit = 4): Promise<YoutubeVideo[]> {
  try {
    const response = await fetch(youtubeFeedUrl, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/atom+xml, application/xml, text/xml",
      },
    });
    if (!response.ok) return [];
    const xml = await response.text();
    return parseYoutubeFeed(xml).slice(0, limit);
  } catch {
    return [];
  }
}
