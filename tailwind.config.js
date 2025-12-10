export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-active': 'var(--color-primary-active)',
        secondary: 'var(--color-secondary)',
        'secondary-hover': 'var(--color-secondary-hover)',
        'secondary-active': 'var(--color-secondary-active)',
        action: 'var(--color-action)',
        'action-hover': 'var(--color-action-hover)',
        'action-text': 'var(--color-action-text)',
        surface: 'var(--color-surface)',
        'surface-hover': 'var(--color-surface-hover)',        
        input: 'var(--color-input)',
        text: 'var(--color-text)',        
      },
    },
  },
  plugins: [],
}