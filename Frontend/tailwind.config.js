/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Ajout d'une palette de couleurs étendue (vous pouvez modifier les valeurs)
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bdd7ff',
          300: '#9eceff',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        accent: '#4ade80', // Exemple de couleur d'accent
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Vous pouvez ajouter d'autres couleurs personnalisées ici
      },
      // Personnalisation des polices (nécessite l'importation des polices dans votre CSS)
      fontFamily: {
        'sans': ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        'serif': ['Merriweather', 'serif'],
        'mono': ['Consolas', 'monospace'],
        // Ajoutez d'autres familles de polices si nécessaire
      },
      // Ajout d'espacements personnalisés
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
        '128': '32rem',
      },
      // Personnalisation des breakpoints (vous pouvez les adapter)
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // Personnalisation des ombres (vous pouvez ajouter les vôtres)
      boxShadow: {
        'custom-light': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'custom-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'custom-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'custom-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Plugin pour styliser les formulaires
    require('@tailwindcss/typography'), // Plugin pour une belle typographie par défaut
    // Vous pouvez ajouter d'autres plugins ici
  ],
};