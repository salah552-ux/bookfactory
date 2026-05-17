import { useState } from "react";

/**
 * Refined book cover — modern minimal. Tinted card with Playfair serif
 * title centred. Drops in /covers/<slug>.{png,jpg,webp} when available.
 */
const GENRE_PALETTES: Record<
  string,
  { from: string; to: string; ink: string }
> = {
  "NONFICTION-HEALTH":   { from: "#dcfce7", to: "#bbf7d0", ink: "#166534" },
  "NONFICTION-BUSINESS": { from: "#dbeafe", to: "#bfdbfe", ink: "#1e3a8a" },
  FICTION:               { from: "#f3f4f6", to: "#e5e7eb", ink: "#111827" },
  "FICTION-MYSTERY":     { from: "#fce7f3", to: "#fbcfe8", ink: "#831843" },
  DEFAULT:               { from: "#f3f4f6", to: "#e5e7eb", ink: "#111827" },
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
  const palette = GENRE_PALETTES[genre ?? "DEFAULT"] ?? GENRE_PALETTES.DEFAULT;
  const dims =
    size === "sm" ? { w: 48, h: 64, t: 9 }
    : size === "lg" ? { w: 112, h: 152, t: 16 }
    : { w: 72, h: 96, t: 11 };

  const [extIndex, setExtIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(!slug);

  if (!imageFailed && slug) {
    const src = `${import.meta.env.BASE_URL ?? "/"}covers/${slug}.${EXTENSIONS[extIndex]}`;
    return (
      <img
        src={src}
        alt={title}
        style={{ width: dims.w, height: dims.h }}
        className="rounded-md shrink-0 object-cover shadow-md border border-line"
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
      }}
      className="relative rounded-md shrink-0 overflow-hidden flex items-center justify-center p-3 shadow-md border border-line"
    >
      <div
        className="text-center"
        style={{
          color: palette.ink,
          fontFamily: '"Playfair Display", Georgia, serif',
          fontWeight: 600,
          fontSize: dims.t,
          lineHeight: 1.1,
          letterSpacing: "-0.01em",
        }}
      >
        {title.split(" ").slice(0, 4).join(" ")}
      </div>
    </div>
  );
}
