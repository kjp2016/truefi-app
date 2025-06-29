import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#BFC4CD',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
        sky: {
          50: '#E3F3FF',
          100: '#D1ECFF',
          200: '#B6E1FF',
          300: '#A0D7FF',
          400: '#7BC8FF',
          500: '#67BFFF',
          600: '#56B1F3',
          700: '#3193DA',
          800: '#1C71AE',
          900: '#124D79',
          950: '#0B324F',
        },
        green: {
          50: '#D2FFE2',
          100: '#B1FDCD',
          200: '#8BF0B0',
          300: '#67E294',
          400: '#4BD37D',
          500: '#3EC972',
          600: '#34BD68',
          700: '#239F52',
          800: '#15773A',
          900: '#0F5429',
          950: '#0A3F1E',
        },
        red: {
          50: '#FFE8E8',
          100: '#FFD1D1',
          200: '#FFB2B2',
          300: '#FF9494',
          400: '#FF7474',
          500: '#FF5656',
          600: '#FA4949',
          700: '#E63939',
          800: '#C52727',
          900: '#941818',
          950: '#600F0F',
        },
        yellow: {
          50: '#FFF2C9',
          100: '#FFE7A0',
          200: '#FFE081',
          300: '#FFD968',
          400: '#F7CD4C',
          500: '#F0BB33',
          600: '#DFAD2B',
          700: '#BC9021',
          800: '#816316',
          900: '#4F3D0E',
          950: '#342809',
        },
        violet: {
          50: '#F1EEFF',
          100: '#E6E1FF',
          200: '#D2CBFF',
          300: '#B7ACFF',
          400: '#9C8CFF',
          500: '#8470FF',
          600: '#755FF8',
          700: '#5D47DE',
          800: '#4634B1',
          900: '#2F227C',
          950: '#1C1357',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        // "accordion-down": {
        //   from: { height: 0 },
        //   to: { height: "var(--radix-accordion-content-height)" },
        // },
        // "accordion-up": {
        //   from: { height: "var(--radix-accordion-content-height)" },
        //   to: { height: 0 },
        // },
        spin: {
          "0%": {
            rotate: "0deg",
          },
          "15%, 35%": {
            rotate: "90deg",
          },
          "65%, 85%": {
            rotate: "270deg",
          },
          "100%": {
            rotate: "360deg",
          },
        },
        slide: {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        spin: "spin calc(var(--speed) * 2) infinite linear",
        slide: "slide var(--speed) ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
export default config;
