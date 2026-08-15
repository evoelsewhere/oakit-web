"use client";

import { useEffect, useState } from "react";

const REPOSITORY_URL = "https://github.com/evoelsewhere/oakit";
const LAST_KNOWN_STARS = 1;

function formatStars(stars: number) {
  if (stars < 1_000) return String(stars);

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(stars);
}

export function GitHubLink() {
  const [stars, setStars] = useState(LAST_KNOWN_STARS);

  useEffect(() => {
    const controller = new AbortController();

    async function refreshStars() {
      try {
        const response = await fetch("/api/github-stars", {
          signal: controller.signal,
        });
        if (!response.ok) return;

        const data: unknown = await response.json();
        if (
          typeof data === "object" &&
          data !== null &&
          "stars" in data &&
          typeof data.stars === "number" &&
          Number.isInteger(data.stars) &&
          data.stars >= 0
        ) {
          setStars(data.stars);
        }
      } catch {
        // Keep the last known count when GitHub or the network is unavailable.
      }
    }

    void refreshStars();
    return () => controller.abort();
  }, []);

  const starLabel = `${stars.toLocaleString("en-US")} ${stars === 1 ? "star" : "stars"}`;

  return (
    <a
      className="github-link"
      href={REPOSITORY_URL}
      aria-label={`View OAKit on GitHub · ${starLabel}`}
    >
      <span className="github-main">
        <svg className="github-mark" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 .7A11.5 11.5 0 0 0 8.36 23.1c.58.1.79-.25.79-.56v-2.23c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.58-.29-5.29-1.29-5.29-5.72 0-1.26.45-2.3 1.2-3.1-.12-.29-.52-1.47.11-3.06 0 0 .98-.31 3.16 1.18A10.9 10.9 0 0 1 12 6.05c.98 0 1.95.13 2.87.39 2.19-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.8 1.2 1.84 1.2 3.1 0 4.45-2.72 5.42-5.3 5.71.42.36.79 1.07.79 2.17v3.24c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
        </svg>
        <span className="github-label">GitHub</span>
      </span>
      <span className="github-stars" title={starLabel}>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="m10 2.1 2.34 4.74 5.23.76-3.78 3.69.89 5.21L10 14.04 5.32 16.5l.89-5.21L2.43 7.6l5.23-.76L10 2.1Z" />
        </svg>
        <span>{formatStars(stars)}</span>
      </span>
    </a>
  );
}
