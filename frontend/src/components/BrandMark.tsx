/**
 * BF monogram — geometric SVG with violet→magenta gradient, faceted
 * letterforms, and an outer halo. Replaces the previous text-based mark.
 *
 * Constructed from straight strokes + 45° chamfers so it reads as
 * architectural / 3D rather than typeset. Inspired by the mockup logo.
 */
export function BrandMark({ size = 40 }: { size?: number }) {
  const id = "bf-grad";
  const haloId = "bf-halo";
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      aria-label="BookFactory"
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{
          filter: `drop-shadow(0 0 ${size * 0.4}px rgba(168,85,247,0.55))`,
        }}
      >
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#c084fc" />
            <stop offset="45%"  stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id={haloId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#d946ef" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Outer rounded square plate */}
        <rect
          x="6" y="6" width="88" height="88" rx="18"
          fill={`url(#${id})`}
        />

        {/* Inner highlight (glassy top edge) */}
        <rect
          x="6" y="6" width="88" height="32" rx="18"
          fill="white" opacity="0.12"
        />

        {/* Chamfered B + F monogram drawn as a single path */}
        <g fill="white" opacity="0.96">
          {/* B — chamfered uppercase */}
          <path d="
            M 20 26
            L 42 26
            L 50 34
            L 50 44
            L 46 48
            L 50 52
            L 50 66
            L 42 74
            L 20 74
            Z
            M 28 34
            L 28 46
            L 40 46
            L 42 44
            L 42 36
            L 40 34
            Z
            M 28 54
            L 28 66
            L 40 66
            L 42 64
            L 42 56
            L 40 54
            Z
          " fillRule="evenodd" />

          {/* F — chamfered uppercase, positioned right */}
          <path d="
            M 56 26
            L 80 26
            L 80 34
            L 64 34
            L 64 46
            L 76 46
            L 76 54
            L 64 54
            L 64 74
            L 56 74
            Z
          " />
        </g>
      </svg>
    </div>
  );
}
