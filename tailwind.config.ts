import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: "#ff6b00",
        "accent-hover": "#e55f00",
        bg: {
          light: "#fafafa",
          dark: "#0d0d0d",
        },
        surface: {
          light: "#ffffff",
          dark: "#1a1a1a",
        },
        muted: {
          light: "#666666",
          dark: "#999999",
        },
        border: {
          light: "#e5e5e5",
          dark: "#2b2b2b",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Fragment Mono", "monospace"],
      },
      maxWidth: {
        container: "840px",
      },
    },
  },
  plugins: [],
};

export default config;
