import { CATALOG_DOWNLOAD_FILENAME, CATALOG_DOWNLOAD_HREF } from "@/lib/catalog";

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M12 4v10m0 0 4-4m-4 4-4-4M5 18h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type CatalogDownloadButtonProps = {
  variant?: "solid" | "ghost";
  label?: string;
  className?: string;
};

export function CatalogDownloadButton({
  variant = "ghost",
  label = "Baixar catálogo",
  className = "",
}: CatalogDownloadButtonProps) {
  const styles =
    variant === "solid"
      ? "bg-signal text-white hover:bg-[#c4242c]"
      : "border border-ice/25 bg-void text-ice hover:border-signal hover:text-signal";

  return (
    <a
      href={CATALOG_DOWNLOAD_HREF}
      download={CATALOG_DOWNLOAD_FILENAME}
      className={`inline-flex min-h-12 items-center justify-center gap-2 px-5 font-body text-[0.8125rem] font-semibold tracking-[0.08em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none ${styles} ${className}`}
    >
      <DownloadIcon />
      {label}
    </a>
  );
}
