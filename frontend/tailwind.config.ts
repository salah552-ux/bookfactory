import type { Config } from "tailwindcss";

/**
 * Linear/Vercel-grade design system.
 *
 *   bg          0a0a0a    near-black canvas
 *   surface     111       cards, panels, primary surfaces
 *   raised     171717    elevated surfaces (hover, nested)
 *   line        rgba(255,255,255,0.06)  hairline borders
 *   line-2      rgba(255,255,255,0.10)  emphasised borders
 *   text-1      fafafa    headings, primary text
 *   text-2      a1a1aa    secondary text, labels
 *   text-3      71717a    tertiary text, hints
 *   text-4      52525b    disabled, decorative
 *   accent      c8b99a    brand-tan — used sparingly
 *
 * Type scale (matches Inter optical sizes used by Linear):
 *   xs   11 / 16
 *   sm   12 / 18
 *   base 13 / 20
 *   md   14 / 22
 *   lg   16 / 24
 *   xl   20 / 28
 *   2xl  28 / 36
 *   3xl  40 / 48
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg:      "#0a0a0a",
        surface: "#111111",
        raised:  "#171717",
        line:    "rgba(255,255,255,0.06)",
        "line-2":"rgba(255,255,255,0.10)",
        "text-1":"#fafafa",
        "text-2":"#a1a1aa",
        "text-3":"#71717a",
        "text-4":"#52525b",
        // Brand accent (identity): used for active nav, brand mark, focus rings
        accent:        "#c8b99a",
        "accent-soft": "rgba(200,185,154,0.10)",
        // Action accent (the IDE "run/execute" green per ui-ux-pro-max design
        // system for Developer Tool / IDE category — most CTAs in this app
        // are "Run agent", so primary actions get this colour, not white).
        run:           "#22c55e",
        "run-soft":    "rgba(34,197,94,0.12)",
        brand: {
          navy: "#1b3a5c",
          tan:  "#c8b99a",
          ink:  "#0a0a0a",
        },
        ok:   "#10b981",
        warn: "#f59e0b",
        err:  "#ef4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs:   ["11px", { lineHeight: "16px", letterSpacing: "0.01em" }],
        sm:   ["12px", { lineHeight: "18px" }],
        base: ["13px", { lineHeight: "20px" }],
        md:   ["14px", { lineHeight: "22px" }],
        lg:   ["16px", { lineHeight: "24px" }],
        xl:   ["20px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
        "2xl":["28px", { lineHeight: "36px", letterSpacing: "-0.02em" }],
        "3xl":["40px", { lineHeight: "48px", letterSpacing: "-0.025em" }],
      },
      borderRadius: {
        none: "0",
        sm:   "4px",
        md:   "6px",
        lg:   "8px",
        xl:   "10px",
      },
      spacing: {
        0.5: "2px",
        1:   "4px",
        1.5: "6px",
        2:   "8px",
        3:   "12px",
        4:   "16px",
        5:   "20px",
        6:   "24px",
        8:   "32px",
        10:  "40px",
        12:  "48px",
        16:  "64px",
        20:  "80px",
      },
      boxShadow: {
        sm: "0 1px 0 rgba(255,255,255,0.04) inset, 0 1px 2px rgba(0,0,0,0.4)",
        md: "0 1px 0 rgba(255,255,255,0.05) inset, 0 2px 8px -2px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
} satisfies Config;
