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
        // Primary colors
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-active': 'var(--color-primary-active)',
        // Secondary colors
        secondary: 'var(--color-secondary)',
        'secondary-hover': 'var(--color-secondary-hover)',
        'secondary-active': 'var(--color-secondary-active)',
        // Action colors
        action: 'var(--color-action)',
        'action-hover': 'var(--color-action-hover)',
        'action-text': 'var(--color-action-text)',
        'action-text-hover': 'var(--color-action-text-hover)',
        // Action header colors
        'action-header': 'var(--color-action-header)',
        'action-header-hover': 'var(--color-action-header-hover)',
        'action-header-text': 'var(--color-action-header-text)',
        'action-header-hover-text': 'var(--color-action-header-hover-text)',
        // Surface colors
        surface: 'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        'surface-hover': 'var(--color-surface-hover)',  
        // Input colors      
        input: 'var(--color-input)',
        text: 'var(--color-text)',  
        // Border colors
        ring: 'var(--color-ring)',
        dashed: 'var(--color-dashed)',              
      },
    },
  },
  plugins: [],
}