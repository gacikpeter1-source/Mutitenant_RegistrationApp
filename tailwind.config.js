/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
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
        // Dynamic theme colors - updated by ThemeProvider
        primary: {
          DEFAULT: 'var(--color-primary)',
          yellow: 'var(--color-primary)',
          gold: 'var(--color-primary-dark)',
          foreground: 'var(--color-background-darkest)',
        },
        background: {
          DEFAULT: 'var(--color-background-darkest)',
          darkest: 'var(--color-background-darkest)',
          dark: 'var(--color-background-dark)',
          card: 'var(--color-background-card)',
          cardHover: 'var(--color-background-card-hover)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        border: {
          DEFAULT: 'var(--color-border-default)',
          light: 'var(--color-border-light)',
        },
        status: {
          success: '#22c55e',
          danger: '#ef4444',
          muted: '#6b7280',
        },
        // Shadcn compatibility
        input: 'var(--color-border-default)',
        ring: 'var(--color-primary)',
        foreground: 'var(--color-text-primary)',
        secondary: {
          DEFAULT: 'var(--color-background-card)',
          foreground: 'var(--color-text-secondary)',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: 'var(--color-background-card)',
          foreground: 'var(--color-text-muted)',
        },
        accent: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-background-darkest)',
        },
        popover: {
          DEFAULT: 'var(--color-background-card)',
          foreground: 'var(--color-text-primary)',
        },
        card: {
          DEFAULT: 'var(--color-background-card)',
          foreground: 'var(--color-text-primary)',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
