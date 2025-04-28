import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import typography from '@tailwindcss/typography';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      typography: ({ theme }) => ({
        invert: {
          css: {
            '--tw-prose-body': theme('colors.neoplay.green'),
            '--tw-prose-headings': theme('colors.neoplay.green'),
            '--tw-prose-links': theme('colors.neoplay.green'),
            '--tw-prose-bold': theme('colors.neoplay.green'),
            '--tw-prose-bullets': theme('colors.neoplay.green'),
            '--tw-prose-counters': theme('colors.neoplay.green'),
            '--tw-prose-quotes': theme('colors.neoplay.green'),
            '--tw-prose-code': theme('colors.neoplay.green'),
            '--tw-prose-pre-bg': theme('colors.neoplay.green'),
            '--tw-prose-pre-border': theme('colors.neoplay.green'),
            '--tw-prose-hr': theme('colors.neoplay.green'),
            fontSize: '0.875rem', // 14px (Tailwind's text-sm)
            lineHeight: 'inherit',
            p: {
              marginTop: '0.15em',
              marginBottom: '0.15em'
            },
            ul: {
              marginTop: '0.15em',
              marginBottom: '0.15em',
              paddingLeft: '1.1em'
            },
            li: {
              marginTop: '0',
              marginBottom: '0'
            },
            code: {
              backgroundColor: `${theme('colors.neoplay.green')} !important`,
              color: `${theme('colors.neoplay.black')} !important`,
              borderRadius: '0.5em',
              padding: '0.2em 0.4em'
            }
          }
        }
      }),
      // <-- comma added above
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        // Neoplay custom colors
        neoplay: {
          black: '#0A0A0A',
          green: '#4AFF00',
          darkGreen: '#39CC00',
          // darkGreen: '#2CA800',
          gray: '#333333',
          lightGray: '#555555'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'pixel-shine': {
          '0%': {
            boxShadow: '0 0 5px #4AFF00',
            opacity: '1'
          },
          '50%': {
            boxShadow: '0 0 20px #4AFF00',
            opacity: '0.8'
          },
          '100%': {
            boxShadow: '0 0 5px #4AFF00',
            opacity: '1'
          }
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'slide-out-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'text-flicker': {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '1'
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.4' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pixel-shine': 'pixel-shine 2s infinite ease-in-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-out-left': 'slide-out-left 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-out',
        'text-flicker': 'text-flicker 5s linear infinite'
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        mono: ['monospace']
      }
    }
  },
  plugins: [tailwindcssAnimate, typography]
} satisfies Config;
