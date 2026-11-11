/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1380px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#083D2E', // Brand Emerald Green
          hover: '#052A20',
          light: '#0E5C46',
          foreground: '#FFFFFF',
        },
        gold: {
          DEFAULT: '#D4A64A', // Brand Gold
          hover: '#C29337',
          light: '#F4E8D0',
          dark: '#A67C27',
          foreground: '#1B1405',
        },
        offwhite: '#F8F8F8',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
        none: '0px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '10px',
        '2xl': '12px',
        '3xl': '14px',
        full: '9999px',
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(8, 61, 46, 0.04)',
        'premium': '0 10px 30px -5px rgba(8, 61, 46, 0.08), 0 4px 6px -2px rgba(8, 61, 46, 0.04)',
        'elevated': '0 20px 40px -15px rgba(8, 61, 46, 0.12)',
      },
    },
  },
  plugins: [],
}
