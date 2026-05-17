import { useState } from "react";

/**
 * Editorial book cover. Drops in /covers/<slug>.{png,jpg,webp} when
 * available; otherwise renders a stylised antique-paper placeholder with
 * the title set in display serif. Inspired by Penguin Classics covers —
 * single warm field + framed serif title.
 */
const GENRE_TINTS: Record<
  string,
  { from: string; to: string; ink: string; band: string }
> = {
  "NONFICTION-HEALTH":   { from: "#3a4a40", to: "#1f2620", ink: "#e8d9b0", band: "#7a8f7d" },
  "NONFICTION-BUSINESS": { from: "#3a4252", to: "#1f2330", ink: "#e8d9b0", band: "#6b7a96" },
  FICTION:               { from: "#2a2620", to: "#14110d", ink: "#e8d9b0", band: "#8c7a5a" },
  "FICTION-MYSTERY":     { from: "#3b1e1e", to: "#1a0c0c", ink: "#e8d9b0", band: "#a4544d" },
  DEFAULT:               { from: "#2a2620", to: "#14110d", ink: "#e8d9b0", band: "#8c7a5a" },
};

const EXTENSIONS = ["png", "jpg", "jpeg", "webp"] as const;

export function BookCover({
  title,
  genre,
  slug,
  size = "md",
}: {
  title: string;
  genre?: string;
  slug?: string;
  size?: "sm" | "md" | "lg";
}) {
  const palette = GENRE_TINTS[genre ?? "DEFAULT"] ?? GENRE_TINTS.DEFAULT;
  const dims =
    size === "sm" ? { w: 48, h: 64, t: 8 }
    : size === "lg" ? { w: 120, h: 160, t: 14 }
    : { w: 72, h: 96, t: 10 };

  const [extIndex, setExtIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(!slug);

  if (!imageFailed && slug) {
    const src = `${import.meta.env.BASE_URL ?? "/"}covers/${slug}.${EXTENSIONS[extIndex]}`;
    return (
      <img
        src={src}
        alt={title}
        style={{ width: dims.w, height: dims.h }}
        className="rounded-[2px] shrink-0 object-cover shadow-soft ring-1 ring-line"
        onError={() => {
          if (extIndex < EXTENSIONS.length - 1) setExtIndex(extIndex + 1);
          else setImageFailed(true);
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: dims.w,
        height: dims.h,
        background: `linear-gradient(180deg, ${palette.from} 0%, ${palette.to} 100%)`,
        boxShadow:
          "inset 0 1px 0 rgba(245,239,224,0.10), 0 8px 24px -16px rgba(0,0,0,0.8)",
      }}
      className="relative rounded-[2px] shrink-0 overflow-hidden flex flex-col"
    >
      {/* Top hairline frame */}
      <div
        className="mx-2 mt-2 border-t border-b"
        style={{
          borderColor: palette.band,
          opacity: 0.5,
          paddingBlock: 2,
        }}
      >
        <div
          className="text-center"
          style={{
            color: palette.ink,
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: dims.t * 0.55,
            letterSpacing: "0.16em",
          }}
        >
          BF
        </div>
      </div>

      {/* Title set in display italic */}
      <div className="flex-1 flex items-center justify-center p-2 text-center">
        <div
          style={{
            color: palette.ink,
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: "italic",
            fontSize: dims.t,
            lineHeight: 1.1,
            fontWeight: 500,
          }}
        >
          {title.split(" ").slice(0, 4).join(" ")}
        </div>
      </div>

      {/* Bottom band like a Penguin Classic */}
      <div
        className="mx-2 mb-2 text-center"
        style={{
          color: palette.ink,
          opacity: 0.7,
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: dims.t * 0.45,
          letterSpacing: "0.18em",
          borderTop: `1px solid ${palette.band}`,
          paddingTop: 2,
        }}
      >
        {(genre ?? "BOOK").split("-")[0].slice(0, 6)}
      </div>
    </div>
  );
}
