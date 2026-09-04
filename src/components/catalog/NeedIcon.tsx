import type { NeedIconId } from "@/lib/need-lines";

const icons: Record<NeedIconId, string> = {
  screws: "/icons/need/bolt.svg",
  nuts: "/icons/need/nut.svg",
  "hand-tools": "/icons/need/hammer.svg",
  "power-tools": "/icons/need/unplug.svg",
  discs: "/icons/need/circle-dot.svg",
  drills: "/icons/need/drill.svg",
  wrenches: "/icons/need/wrench.svg",
  chemicals: "/icons/need/flask-conical.svg",
};

export function NeedIcon({ type }: { type: NeedIconId }) {
  return (
    // Lucide icons (ISC).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={icons[type]}
      alt=""
      width={28}
      height={28}
      className="need-card-glyph"
      aria-hidden
    />
  );
}
