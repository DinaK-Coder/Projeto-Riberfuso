export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Capability-based lighter motion: reduced-motion or Save-Data. */
export function prefersLiteExperience(): boolean {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return true;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return Boolean(connection?.saveData);
}
