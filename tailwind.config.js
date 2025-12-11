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
        // Sidebar colors
        sidebar: 'var(--color-sidebar)',
        'sidebar-btn-hover': 'var(--color-sidebar-btn-hover)',
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
        // Chip colors
        chip: 'var(--color-chip)',
        'chip-text': 'var(--color-chip-text)',
        'chip-planned-bg': 'var(--color-chip-planned-bg)',
        'chip-planned-text': 'var(--color-chip-planned-text)',
        'chip-inprogress-bg': 'var(--color-chip-inprogress-bg)',
        'chip-inprogress-text': 'var(--color-chip-inprogress-text)',
        'chip-completed-bg': 'var(--color-chip-completed-bg)',
        'chip-completed-text': 'var(--color-chip-completed-text)',
        'chip-cancelled-bg': 'var(--color-chip-cancelled-bg)',
        'chip-cancelled-text': 'var(--color-chip-cancelled-text)',
      },
    },
  },
  plugins: [],
}