/**
 * Refined brand mark — a serif italic "B" framed by a hairline blue square.
 * Aligned to the `refined` skill: Playfair Display + primary #3B82F6.
 */
export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <div
      className="relative shrink-0 flex items-center justify-center"
      style={{
        width: size,
        height: size,
        border: "1px solid #3b82f6",
        background: "#ffffff",
      }}
      aria-label="BookFactory"
    >
      <span
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontWeight: 700,
          fontStyle: "italic",
          fontSize: size * 0.6,
          color: "#3b82f6",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        B
      </span>
    </div>
  );
}
