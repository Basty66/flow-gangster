export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        deep: '#000000',
        surface: '#0d0d0d',
        surface2: '#1a1a1a',
        border: '#333333',
        orange: '#ff5a00',
        'orange-light': '#ff7733',
        gray: '#999999',
        'gray-dark': '#666666',
      },
    },
  },
  plugins: [],
};
