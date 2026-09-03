/**
 * Waits for the two priority Hero images already requested by Next/Image.
 * Does not wait on fonts (display:swap) or the below-fold panels.
 */
export type HeroLoadProgress = {
  loaded: number;
  total: number;
  ratio: number;
};

const SAFETY_TIMEOUT_MS = 800;

function waitForImg(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalWidth > 0) return Promise.resolve();

  return new Promise((resolve) => {
    const done = () => {
      img.removeEventListener("load", done);
      img.removeEventListener("error", done);
      resolve();
    };
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  });
}

export function loadHeroAssets(
  root: HTMLElement,
  onProgress: (progress: HeroLoadProgress) => void,
): Promise<void> {
  const imgs = Array.from(
    root.querySelectorAll<HTMLImageElement>("[data-hero-panel] img"),
  ).slice(0, 2);
  const total = Math.max(imgs.length, 1);
  let loaded = 0;

  const bump = () => {
    loaded += 1;
    onProgress({
      loaded: Math.min(loaded, total),
      total,
      ratio: Math.min(loaded / total, 1),
    });
  };

  onProgress({ loaded: 0, total, ratio: 0 });

  const imageTasks =
    imgs.length > 0
      ? imgs.map((img) => waitForImg(img).finally(bump))
      : [Promise.resolve().finally(bump)];

  const all = Promise.all(imageTasks).then(() => undefined);

  const safety = new Promise<void>((resolve) => {
    window.setTimeout(() => {
      onProgress({ loaded: total, total, ratio: 1 });
      resolve();
    }, SAFETY_TIMEOUT_MS);
  });

  return Promise.race([all, safety]);
}
