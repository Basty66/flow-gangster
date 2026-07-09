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
        deep: '#0a0a0f',
        surface: '#12121a',
        purple: '#8b5cf6',
        cyan: '#22d3ee',
        orange: '#f97316',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(60px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'tilt': {
          '0%, 100%': { transform: 'skew(0deg, 0deg)' },
          '25%': { transform: 'skew(0.5deg, -0.3deg)' },
          '75%': { transform: 'skew(-0.3deg, 0.5deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139,92,246,0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(139,92,246,0.3)' },
        },
        'float': {
          '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '25%': { transform: 'translate(120px, -60px) rotate(5deg)' },
          '50%': { transform: 'translate(60px, 80px) rotate(-3deg)' },
          '75%': { transform: 'translate(-80px, 40px) rotate(4deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '25%': { transform: 'translate(-100px, 50px) rotate(-4deg)' },
          '50%': { transform: 'translate(-50px, -70px) rotate(3deg)' },
          '75%': { transform: 'translate(90px, -30px) rotate(-5deg)' },
        },
        'morph': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.4' },
          '25%': { transform: 'translate(60px, -40px) scale(1.15)', opacity: '0.25' },
          '50%': { transform: 'translate(-30px, 60px) scale(0.9)', opacity: '0.35' },
          '75%': { transform: 'translate(40px, 30px) scale(1.05)', opacity: '0.2' },
        },
        'morph2': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.35' },
          '25%': { transform: 'translate(-50px, 50px) scale(0.9)', opacity: '0.2' },
          '50%': { transform: 'translate(40px, -40px) scale(1.2)', opacity: '0.3' },
          '75%': { transform: 'translate(-30px, -20px) scale(1.05)', opacity: '0.25' },
        },
        'morph3': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.2' },
          '25%': { transform: 'translate(-30px, -30px) scale(1.1)', opacity: '0.15' },
          '50%': { transform: 'translate(40px, 20px) scale(0.85)', opacity: '0.25' },
          '75%': { transform: 'translate(-20px, 40px) scale(1.15)', opacity: '0.1' },
        },
        'typewriter': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'tilt': 'tilt 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 24s ease-in-out infinite',
        'float-reverse': 'float-reverse 20s ease-in-out infinite',
        'morph': 'morph 12s ease-in-out infinite',
        'morph2': 'morph2 10s ease-in-out infinite',
        'morph3': 'morph3 14s ease-in-out infinite',
        'typewriter': 'typewriter 1.5s steps(40) forwards',
      },
    },
  },
  plugins: [],
};
