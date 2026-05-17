/**
 * BF monogram in the ChatGPT mockup style — violet→magenta gradient on a
 * rounded square tile, soft glow.
 */
export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-xl flex items-center justify-center font-bold text-white shrink-0"
      style={{
        width: size,
        height: size,
        background:
          "linear-gradient(135deg, #a855f7 0%, #d946ef 50%, #ec4899 100%)",
        boxShadow:
          "0 0 24px -6px rgba(168,85,247,0.6), inset 0 1px 0 rgba(255,255,255,0.25)",
        fontSize: size * 0.42,
        letterSpacing: "-0.02em",
        fontFamily: "Inter, sans-serif",
      }}
    >
      BF
    </div>
  );
}
