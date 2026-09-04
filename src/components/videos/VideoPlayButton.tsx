type VideoPlayButtonProps = {
  size?: "featured" | "card";
  label: string;
  as?: "button" | "span";
  onClick?: () => void;
};

export function VideoPlayButton({
  size = "card",
  label,
  as = "span",
  onClick,
}: VideoPlayButtonProps) {
  const className = `video-play-button video-play-button-${size}`;
  const icon = (
    <svg viewBox="0 0 24 24" className="video-play-icon" aria-hidden>
      <path d="M8.2 5.6v12.8L19.6 12 8.2 5.6z" />
    </svg>
  );

  if (as === "button") {
    return (
      <button
        type="button"
        className={className}
        aria-label={label}
        onClick={onClick}
      >
        {icon}
      </button>
    );
  }

  return (
    <span className={className} aria-hidden>
      {icon}
    </span>
  );
}
