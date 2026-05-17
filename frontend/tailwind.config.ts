import type { Config } from "tailwindcss";

/**
 * Design system v5 — matches the ChatGPT mockup (deep navy + neon accents).
 * Visual reference: see prompt history for the source image.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg:        "#0a0f1e",   // canvas
        "bg-side": "#0a0f1d",   // sidebar (slightly cooler)
        surface:   "#111933",   // cards/containers
        "surface-2": "#162042", // elevated / hover
        raised:    "#1a2548",   // emphasised surfaces
        line:    "rgba(255,255,255,0.06)",
        "line-2":"rgba(255,255,255,0.10)",
        "line-3":"rgba(255,255,255,0.18)",
        "text-1":"#ffffff",
        "text-2":"#a3b1c6",
        "text-3":"#6b7a96",
        "text-4":"#475168",
        // Accent neons (used for stage states + stat icons)
        violet:   "#a855f7",
        "violet-2": "#c084fc",
        magenta:  "#ec4899",
        cyan:     "#06b6d4",
        green:    "#10b981",
        orange:   "#f59e0b",
        red:      "#ef4444",
        // Brand alias kept for code that still references it
        accent:   "#a855f7",
        run:      "#10b981",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs:   ["11px", { lineHeight: "16px" }],
        sm:   ["12px", { lineHeight: "18px" }],
        base: ["13px", { lineHeight: "20px" }],
        md:   ["14px", { lineHeight: "22px" }],
        lg:   ["16px", { lineHeight: "24px" }],
        xl:   ["20px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
        "2xl":["28px", { lineHeight: "36px", letterSpacing: "-0.02em" }],
        "3xl":["40px", { lineHeight: "48px", letterSpacing: "-0.025em" }],
      },
      borderRadius: {
        sm:  "4px",
        md:  "8px",
        lg:  "12px",
        xl:  "16px",
        "2xl": "20px",
      },
      boxShadow: {
        glow:        "0 0 24px -4px rgba(168,85,247,0.40)",
        "glow-cyan": "0 0 24px -4px rgba(6,182,212,0.40)",
        "glow-green":"0 0 24px -4px rgba(16,185,129,0.40)",
        "glow-orange":"0 0 24px -4px rgba(245,158,11,0.40)",
        "glow-red":  "0 0 24px -4px rgba(239,68,68,0.40)",
        card:        "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px -8px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
} satisfies Config;
