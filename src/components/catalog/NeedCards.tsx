import Link from "next/link";
import { needLines } from "@/lib/need-lines";
import { NeedIcon } from "./NeedIcon";

export function NeedCards() {
  return (
    <ul className="need-grid" data-need-cards>
      {needLines.map((line) => (
        <li key={line.id}>
          <Link
            href={line.href}
            className="need-card group"
            aria-label={`${line.name}. ${line.description}`}
          >
            <span className="need-card-icon">
              <NeedIcon type={line.icon} />
            </span>
            <span className="min-w-0">
              <span className="need-card-title">{line.name}</span>
              <span className="need-card-desc">{line.description}</span>
            </span>
            <span className="need-card-cta">
              Consultar estoque
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
                <path
                  d="M3 8h10m0 0L9 4m4 4L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
