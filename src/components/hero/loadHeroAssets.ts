/**
 * Waits for Hero assets already requested by Next/Image in the DOM.
 * Does NOT create a second network fetch (that was doubling load time).
 */
export type HeroLoadProgress = {
  loaded: number;
  total: number;
  ratio: number;
};

const SAFETY_TIMEOUT_MS = 1400;

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
  );
  const total = Math.max(imgs.length, 1) + 1; // images + fonts
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

  const fontTask = (document.fonts?.ready ?? Promise.resolve()).finally(bump);

  const all = Promise.all([...imageTasks, fontTask]).then(() => undefined);

  const safety = new Promise<void>((resolve) => {
    window.setTimeout(() => {
      onProgress({ loaded: total, total, ratio: 1 });
      resolve();
    }, SAFETY_TIMEOUT_MS);
  });

  return Promise.race([all, safety]);
}
