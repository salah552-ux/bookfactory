/**
 * Editorial brand mark — a gold serif "B" inside a hairline gold square,
 * like an old publisher's colophon. Replaces the previous SVG monogram.
 */
export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <div
      className="relative shrink-0 flex items-center justify-center"
      style={{
        width: size,
        height: size,
        border: "1px solid rgba(202,138,4,0.55)",
        background:
          "radial-gradient(60% 60% at 50% 40%, rgba(202,138,4,0.08), transparent 70%), rgba(202,138,4,0.04)",
      }}
      aria-label="BookFactory"
    >
      <span
        style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontWeight: 600,
          fontStyle: "italic",
          fontSize: size * 0.58,
          color: "#ca8a04",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          textShadow: "0 0 12px rgba(202,138,4,0.3)",
        }}
      >
        ℬ
      </span>
    </div>
  );
}
