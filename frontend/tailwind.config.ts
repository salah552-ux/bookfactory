import type { Config } from "tailwindcss";

/**
 * Design system v6 — EDITORIAL DARK.
 *
 *   A literary magazine that became a control surface.
 *
 *   Driven by the ui-ux-pro-max skill recommendation for the "publishing /
 *   editorial" product category, and the frontend-design skill's mandate
 *   to commit to a bold aesthetic.
 *
 *   Style: Editorial Grid / Magazine (WCAG AAA)
 *   Type:  Cormorant Garamond (display) + Libre Baskerville (body) +
 *          IBM Plex Mono (data/code)
 *   Canvas: warm dark brown-black with cream text and surgical gold accent
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Warm-dark editorial canvas
        bg:        "#1a1614",   // brown-black paper
        "bg-side": "#14110f",   // sidebar (slightly deeper)
        surface:   "#231f18",   // cards / panels
        "surface-2":"#2c2820",  // elevated
        raised:    "#332e25",
        // Cream-tinted borders for warmth
        line:    "rgba(232,217,188,0.08)",
        "line-2":"rgba(232,217,188,0.14)",
        "line-3":"rgba(232,217,188,0.22)",
        // Type scale (cream tones for paper-on-ink feel)
        "text-1":"#f5efe0",
        "text-2":"#b8ad96",
        "text-3":"#847962",
        "text-4":"#5a5141",
        // Surgical accent (Penguin Classic gold)
        gold:     "#ca8a04",
        "gold-2": "#eab308",
        "gold-soft": "rgba(202,138,4,0.10)",
        // Brand aliases for code that still imports them
        accent:   "#ca8a04",
        "accent-soft": "rgba(202,138,4,0.10)",
        // Status tones — muted to suit editorial aesthetic
        ok:       "#6b8e7f",
        warn:     "#d4a655",
        err:      "#a4544d",
        run:      "#6b8e7f",
        // Stage tone aliases (used by older components — map to editorial)
        violet:    "#ca8a04",
        "violet-2":"#eab308",
        magenta:   "#a4544d",
        cyan:      "#6b8e7f",
        green:     "#6b8e7f",
        orange:    "#d4a655",
        red:       "#a4544d",
        brand: {
          navy: "#1a1614",
          tan:  "#b8ad96",
          ink:  "#0c0a08",
        },
      },
      fontFamily: {
        // Editorial serif — used for ALL page titles, book titles, key headings
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        serif:   ['"Cormorant Garamond"', "Georgia", "serif"],
        // Body — readable book serif for descriptions
        body:    ['"Libre Baskerville"', "Georgia", "serif"],
        sans:    ['"Libre Baskerville"', "Georgia", "serif"],
        // Mono — characterful with editorial alternate forms
        mono:    ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        // Slightly more generous than the previous Inter scale because
        // serif body type needs more vertical space.
        xs:   ["11px", { lineHeight: "16px", letterSpacing: "0.04em" }],
        sm:   ["12px", { lineHeight: "18px" }],
        base: ["13px", { lineHeight: "21px" }],
        md:   ["14px", { lineHeight: "23px" }],
        lg:   ["17px", { lineHeight: "26px" }],
        xl:   ["22px", { lineHeight: "30px", letterSpacing: "-0.01em" }],
        "2xl":["32px", { lineHeight: "38px", letterSpacing: "-0.015em" }],
        "3xl":["48px", { lineHeight: "54px", letterSpacing: "-0.02em" }],
        "4xl":["64px", { lineHeight: "68px", letterSpacing: "-0.025em" }],
      },
      borderRadius: {
        none: "0",
        sm:  "2px",
        md:  "4px",
        lg:  "6px",
        xl:  "8px",
        "2xl":"12px",
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
        14:  "56px",
        16:  "64px",
        20:  "80px",
        24:  "96px",
        32:  "128px",
      },
      boxShadow: {
        // Soft warm shadow — paper falling onto dark wood
        soft: "0 8px 24px -16px rgba(0,0,0,0.8)",
        gold: "0 0 0 1px rgba(202,138,4,0.30), 0 4px 16px -4px rgba(202,138,4,0.20)",
      },
    },
  },
  plugins: [],
} satisfies Config;
