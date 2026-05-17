import type { Config } from "tailwindcss";

/**
 * Refined design system v7 — applied from `.claude/skills/refined/SKILL.md`.
 *
 *   Style:      modern, minimal
 *   Typography: Playfair Display (primary + display), JetBrains Mono
 *   Type scale: 12 / 14 / 16 / 20 / 24 / 32
 *   Spacing:    4 / 8 / 12 / 16 / 24 / 32
 *   Surface:    #FFFFFF (light)
 *   Text:       #111827
 *   Primary:    #3B82F6
 *   Secondary:  #8B5CF6
 *   Success:    #16A34A
 *   Warning:    #D97706
 *   Danger:     #DC2626
 *   Accessibility: WCAG 2.2 AA, visible focus
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Semantic tokens (refined)
        surface:   "#ffffff",
        "surface-2":"#fafafa",
        raised:    "#f3f4f6",
        bg:        "#ffffff",   // alias for legacy code
        "bg-side": "#fafafa",

        line:    "#e5e7eb",
        "line-2":"#d1d5db",
        "line-3":"#9ca3af",

        "text-1":"#111827",
        "text-2":"#374151",
        "text-3":"#6b7280",
        "text-4":"#9ca3af",

        primary:   "#3b82f6",
        "primary-soft": "#dbeafe",
        secondary: "#8b5cf6",
        "secondary-soft": "#ede9fe",
        success:   "#16a34a",
        warning:   "#d97706",
        danger:    "#dc2626",

        // Aliases kept so older components don't break
        accent:    "#3b82f6",
        "accent-soft": "#dbeafe",
        gold:      "#d97706",
        "gold-soft": "rgba(217,119,6,0.10)",
        ok:        "#16a34a",
        warn:      "#d97706",
        err:       "#dc2626",
        run:       "#16a34a",
        violet:    "#8b5cf6",
        "violet-2":"#a78bfa",
        magenta:   "#dc2626",
        cyan:      "#3b82f6",
        green:     "#16a34a",
        orange:    "#d97706",
        red:       "#dc2626",
        brand: { navy: "#1f2937", tan: "#9ca3af", ink: "#111827" },
      },
      fontFamily: {
        // Refined uses Playfair Display for everything text-y, JetBrains Mono for data
        sans:    ['"Playfair Display"', "Georgia", "serif"],
        body:    ['"Playfair Display"', "Georgia", "serif"],
        display: ['"Playfair Display"', "Georgia", "serif"],
        serif:   ['"Playfair Display"', "Georgia", "serif"],
        mono:    ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        // Refined scale: 12/14/16/20/24/32
        xs:   ["12px", { lineHeight: "18px" }],
        sm:   ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        md:   ["16px", { lineHeight: "24px" }],
        lg:   ["20px", { lineHeight: "28px" }],
        xl:   ["24px", { lineHeight: "32px", letterSpacing: "-0.01em" }],
        "2xl":["32px", { lineHeight: "40px", letterSpacing: "-0.015em" }],
        "3xl":["48px", { lineHeight: "56px", letterSpacing: "-0.02em" }],
        "4xl":["64px", { lineHeight: "72px", letterSpacing: "-0.025em" }],
      },
      borderRadius: {
        none: "0",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
      spacing: {
        // Refined scale: 4/8/12/16/24/32
        0.5: "2px",
        1:   "4px",
        2:   "8px",
        3:   "12px",
        4:   "16px",
        6:   "24px",
        8:   "32px",
        12:  "48px",
        16:  "64px",
        20:  "80px",
        24:  "96px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(17,24,39,0.04)",
        md: "0 4px 12px rgba(17,24,39,0.06)",
        lg: "0 8px 24px rgba(17,24,39,0.08)",
        // Visible focus per WCAG 2.2
        focus: "0 0 0 3px rgba(59,130,246,0.30)",
      },
    },
  },
  plugins: [],
} satisfies Config;
