/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        semantic: {
          bg: 'var(--ui-bg)',
          surface: 'var(--ui-surface)',
          elevated: 'var(--ui-surface-elevated)',
          text: 'var(--ui-text)',
          heading: 'var(--ui-text-heading)',
          muted: 'var(--ui-text-muted)',
          border: 'var(--ui-border)'
        },
        finance: {
          950: '#061529',
          900: '#0b1f3a',
          800: '#102f57',
          700: '#164574',
          600: '#1d5f9f',
          500: '#2777c7',
          100: '#dbeafe'
        },
        growth: {
          950: '#052e24',
          900: '#064e3b',
          700: '#047857',
          600: '#059669',
          500: '#10b981',
          100: '#d1fae5'
        },
        xp: {
          600: '#7c3aed',
          500: '#8b5cf6',
          100: '#ede9fe'
        },
        reward: {
          500: '#f59e0b',
          400: '#fbbf24'
        },
        energy: {
          500: '#06b6d4'
        }
      },
      fontFamily: {
        reading: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '22px',
        xl: '28px',
        '2xl': '36px',
        pill: '999px'
      },
      boxShadow: {
        elevation1: '0 8px 22px rgba(15, 23, 42, .08)',
        elevation2: '0 16px 40px rgba(15, 23, 42, .12)',
        elevation3: '0 28px 70px rgba(15, 23, 42, .18)',
        glow: '0 24px 64px rgba(16, 185, 129, .22)'
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem'
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0b1f3a 0%, #047857 58%, #10b981 100%)',
        'game-gradient': 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 48%, #10b981 100%)',
        'reward-gradient': 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
      }
    }
  },
  plugins: []
};
