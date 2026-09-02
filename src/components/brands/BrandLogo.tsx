"use client";

import { useEffect, useState } from "react";
import type { Brand, BrandMatte } from "@/lib/brands";
import { brandAlt } from "@/lib/brands";

type BrandLogoProps = {
  brand: Brand;
  featured?: boolean;
};

type ProcessMatte = Exclude<BrandMatte, "plain">;

const plateCache = new Map<string, string | null>();

function matteFor(brand: Brand): BrandMatte {
  if (brand.matte) return brand.matte;
  if (/\.(svg|jpe?g)$/i.test(brand.logoSrc)) return "plain";
  return "knock-black";
}

function preparePlate(img: HTMLImageElement, mode: ProcessMatte): string | null {
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  if (!width || !height) return null;

  const source = document.createElement("canvas");
  source.width = width;
  source.height = height;
  const ctx = source.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(img, 0, 0);
  const image = ctx.getImageData(0, 0, width, height);
  const pixels = image.data;

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  let kept = 0;
  let lumaAcc = 0;
  let satAcc = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;

    let alpha = pixels[i + 3];
    let nr = r;
    let ng = g;
    let nb = b;

    if (mode === "knock-black") {
      if (luma < 28 && sat < 0.2) alpha = 0;
    } else if (mode === "trim-white") {
      if (luma > 225 && sat < 0.14) alpha = 0;
    } else if (mode === "ink-lockup") {
      if (luma < 32 && sat < 0.2) {
        alpha = 0;
      } else if (sat < 0.22 && luma > 70) {
        nr = 26;
        ng = 28;
        nb = 32;
        alpha = 255;
      }
    } else if (luma < 36 && sat < 0.22) {
      alpha = 0;
    } else if (luma > 186 && sat < 0.16) {
      nr = 26;
      ng = 28;
      nb = 32;
      alpha = 255;
    }

    pixels[i] = nr;
    pixels[i + 1] = ng;
    pixels[i + 2] = nb;
    pixels[i + 3] = alpha;

    if (alpha > 20) {
      kept += 1;
      lumaAcc += luma;
      satAcc += sat;
      const index = i / 4;
      const x = index % width;
      const y = Math.floor(index / width);
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < 0 || kept < 80) return null;
  if (mode !== "trim-white" && mode !== "ink-lockup" && lumaAcc / kept < 38 && satAcc / kept < 0.16) {
    return null;
  }

  ctx.putImageData(image, 0, 0);

  const pad = Math.max(2, Math.round(Math.max(maxX - minX + 1, maxY - minY + 1) * 0.05));
  const x0 = Math.max(0, minX - pad);
  const y0 = Math.max(0, minY - pad);
  const cropW = Math.min(width - x0, maxX - x0 + 1 + pad);
  const cropH = Math.min(height - y0, maxY - y0 + 1 + pad);

  if (cropW / cropH > (mode === "ink-lockup" || mode === "trim-white" ? 9.5 : 5.2) || cropH / cropW > 3.2) {
    return null;
  }

  const out = document.createElement("canvas");
  out.width = cropW;
  out.height = cropH;
  const outCtx = out.getContext("2d");
  if (!outCtx) return null;
  outCtx.drawImage(source, x0, y0, cropW, cropH, 0, 0, cropW, cropH);
  return out.toDataURL("image/png");
}

export function BrandLogo({ brand, featured = false }: BrandLogoProps) {
  const matte = matteFor(brand);
  const cacheKey = `${brand.logoSrc}:${matte}`;
  const [src, setSrc] = useState<string | null>(() => {
    if (!brand.assetReady) return null;
    if (matte === "plain") return brand.logoSrc;
    return plateCache.get(cacheKey) ?? null;
  });
  const [failed, setFailed] = useState(() => !brand.assetReady);

  useEffect(() => {
    if (!brand.assetReady) {
      setSrc(null);
      setFailed(true);
      return;
    }
    if (matte === "plain") {
      setSrc(brand.logoSrc);
      setFailed(false);
      return;
    }

    const cached = plateCache.get(cacheKey);
    if (cached !== undefined) {
      setSrc(cached);
      if (cached === null) setFailed(true);
      return;
    }

    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      try {
        if (image.naturalWidth * image.naturalHeight > 900_000 && matte !== "trim-white") {
          plateCache.set(cacheKey, brand.logoSrc);
          setSrc(brand.logoSrc);
          return;
        }
        const prepared = preparePlate(image, matte);
        plateCache.set(cacheKey, prepared);
        if (prepared) {
          setSrc(prepared);
        } else {
          setFailed(true);
        }
      } catch {
        plateCache.set(cacheKey, brand.logoSrc);
        setSrc(brand.logoSrc);
      }
    };
    image.onerror = () => {
      plateCache.set(cacheKey, null);
      setFailed(true);
    };
    image.src = brand.logoSrc;
  }, [brand.assetReady, brand.logoSrc, cacheKey, matte]);

  const well = featured
    ? "flex h-auto w-full max-w-[20rem] items-center justify-center"
    : "flex h-full w-full items-center justify-center px-2 py-1.5";

  const imageClass = featured
    ? "max-h-[4.75rem] max-w-[18rem] h-auto w-auto object-contain object-center"
    : "h-[3.85rem] w-auto max-w-[94%] object-contain object-center";

  const labelClass =
    "brand-wordmark font-display font-semibold tracking-[0.08em] uppercase " +
    (featured ? "text-4xl" : "text-[1.35rem] leading-none");

  if (!brand.assetReady || failed) {
    return (
      <span className={well}>
        <span className={labelClass}>{brand.name}</span>
      </span>
    );
  }

  if (!src) {
    return <span className={well} aria-hidden />;
  }

  return (
    <span className={well}>
      {/* Official files only — no invert, brightness, or fill hacks on the source artwork. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={brandAlt(brand)}
        className={imageClass}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
