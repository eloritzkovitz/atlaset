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
        surface: 'var(--color-surface)',        
        input: 'var(--color-input)',
        text: 'var(--color-text)',
      },
    },
  },
  plugins: [],
}