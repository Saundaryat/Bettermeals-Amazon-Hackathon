
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))', // Orange
          "secondary": 'hsl(var(--accent2))', // Pink/purple
          foreground: 'hsl(var(--accent-foreground))'
        },
        // Optionally include a dark neutral palette for text
        neutral: {
          900: "#0B0B11",
          800: "#171923",
          700: "#222c42",
          600: "#445b8a",
          400: "#c5c8e4",
          200: "#e1e5ee",
          100: "#f8fafd"
        },
        white: "#fff",
        // Brand colors used throughout the app
        // leafgreen: {
        //   50: "#f0fdf4",
        //   100: "#dcfce7",
        //   200: "#bbf7d0",
        //   400: "#4ade80",
        //   500: "#22c55e",
        //   700: "#15803d",
        //   900: "#14532d"
        // },
        // peach: {
        //   50: "#fef7f0",
        //   100: "#fef2e2",
        //   200: "#fde2cc",
        //   300: "#fdba74",
        //   400: "#fb923c",
        //   600: "#ea580c",
        //   700: "#c2410c",
        //   800: "#9a3412"
        // },
        brand: {
          beige: '#f7e6cf',
          green: '#51754f',
          darkGreen: '#4a6b46'
        },
      },
      backgroundImage: {
        "lovable-dark-hero": "radial-gradient(ellipse at 50% 35%, #222c42 70%, #171923 100%)",
      },
      dropShadow: {
        zen: "0 6px 28px 0 rgba(44, 63, 102, 0.12)",
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
