/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Black AMOLED Base
        'bg-primary': '#000000',
        'bg-secondary': '#0a0a0a',
        'bg-tertiary': '#111111',
        'bg-card': '#0d0d0d',
        
        // Cyberpunk Neon Colors
        'neon-cyan': '#00ffff',
        'neon-pink': '#ff00ff',
        'neon-green': '#00ff00',
        'neon-blue': '#0080ff',
        'neon-purple': '#8000ff',
        'neon-yellow': '#ffff00',
        'neon-orange': '#ff8000',
        
        // Text Colors
        'text-primary': '#ffffff',
        'text-secondary': '#cccccc',
        'text-tertiary': '#999999',
        'text-accent': '#00ffff',
      },
      backgroundImage: {
        'holo-1': 'linear-gradient(45deg, #00ffff, #ff00ff, #00ff00, #ffff00)',
        'holo-2': 'linear-gradient(135deg, #ff00ff, #0080ff, #00ffff, #8000ff)',
        'holo-3': 'linear-gradient(90deg, #00ff00, #ffff00, #ff8000, #ff00ff)',
      },
      fontFamily: {
        'cyber': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'holographic-text': 'holographic-text 2s ease-in-out infinite alternate',
        'neon-glow': 'neon-glow 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
        'scan-line': 'scan-line 3s ease-in-out infinite',
        'holographic-border': 'holographic-border 2s ease-in-out infinite alternate',
      },
      backdropBlur: {
        'cyber': '20px',
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0, 255, 255, 0.5)',
        'cyber-strong': '0 0 40px rgba(0, 255, 255, 0.7)',
        'neon-pink': '0 0 20px rgba(255, 0, 255, 0.5)',
        'neon-green': '0 0 20px rgba(0, 255, 0, 0.5)',
      },
      borderRadius: {
        'cyber': '12px',
      },
    },
  },
  plugins: [],
}