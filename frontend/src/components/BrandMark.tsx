/**
 * BF monogram — chamfered "B" + "F" letterforms on a violet→magenta
 * gradient tile. Larger halo + crisper letterforms than the previous pass.
 */
export function BrandMark({ size = 40 }: { size?: number }) {
  const id = `bf-grad-${size}`;
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      aria-label="BookFactory"
    >
      {/* Outer halo */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(168,85,247,0.55), transparent 70%)",
          filter: "blur(8px)",
          zIndex: 0,
        }}
      />
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{
          position: "relative",
          zIndex: 1,
          filter: `drop-shadow(0 0 ${size * 0.35}px rgba(168,85,247,0.55))`,
        }}
      >
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#c084fc" />
            <stop offset="45%"  stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>

        <rect x="6" y="6" width="88" height="88" rx="18" fill={`url(#${id})`} />
        <rect x="6" y="6" width="88" height="36" rx="18" fill="white" opacity="0.14" />

        <g fill="#ffffff" fillRule="evenodd">
          <path d="
            M 22 26 L 44 26 L 52 33 L 52 44 L 48 48 L 52 52 L 52 67 L 44 74 L 22 74 Z
            M 30 33.5 L 30 45 L 42 45 L 44 43 L 44 35.5 L 42 33.5 Z
            M 30 54   L 30 66.5 L 42 66.5 L 44 64.5 L 44 56 L 42 54 Z
          " />
          <path d="
            M 56 26 L 80 26 L 80 34.5 L 64 34.5 L 64 46 L 76 46 L 76 54.5 L 64 54.5 L 64 74 L 56 74 Z
          " />
        </g>
      </svg>
    </div>
  );
}
