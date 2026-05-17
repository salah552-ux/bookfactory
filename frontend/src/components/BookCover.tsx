/**
 * Stylised placeholder book cover. Genre-coloured gradient with title
 * typography — looks intentional rather than empty.
 */
const GENRE_PALETTES: Record<
  string,
  { from: string; to: string; accent: string }
> = {
  "NONFICTION-HEALTH":   { from: "#10b981", to: "#065f46", accent: "#a7f3d0" },
  "NONFICTION-BUSINESS": { from: "#3b82f6", to: "#1e3a8a", accent: "#dbeafe" },
  FICTION:               { from: "#1e293b", to: "#0f172a", accent: "#94a3b8" },
  "FICTION-MYSTERY":     { from: "#831843", to: "#1c1917", accent: "#fda4af" },
  DEFAULT:               { from: "#1e293b", to: "#0f172a", accent: "#94a3b8" },
};

export function BookCover({
  title,
  genre,
  size = "md",
}: {
  title: string;
  genre?: string;
  size?: "sm" | "md" | "lg";
}) {
  const palette = GENRE_PALETTES[genre ?? "DEFAULT"] ?? GENRE_PALETTES.DEFAULT;
  const dims =
    size === "sm" ? "w-12 h-16" : size === "lg" ? "w-24 h-32" : "w-16 h-20";

  return (
    <div
      className={`${dims} rounded-md shrink-0 relative overflow-hidden flex flex-col justify-between p-2`}
      style={{
        background: `linear-gradient(160deg, ${palette.from} 0%, ${palette.to} 100%)`,
        boxShadow: `
          0 1px 0 rgba(255,255,255,0.12) inset,
          0 8px 16px -8px rgba(0,0,0,0.6),
          0 0 0 1px rgba(255,255,255,0.08)
        `,
      }}
    >
      {/* Subtle inner highlight */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 80% at 20% 0%, rgba(255,255,255,0.20), transparent 50%)",
        }}
      />
      {/* Bottom serif title */}
      <div className="relative z-10 mt-auto">
        <div
          className="text-[7px] font-bold leading-tight tracking-wide uppercase"
          style={{ color: palette.accent, fontFamily: "Georgia, serif" }}
        >
          {title.slice(0, 32)}
        </div>
      </div>
      {/* Spine line */}
      <div
        className="absolute left-1 top-1 bottom-1 w-px"
        style={{ background: "rgba(255,255,255,0.08)" }}
      />
    </div>
  );
}
