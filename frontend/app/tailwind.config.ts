import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'custom-gradient': 'linear-gradient(89.78deg, rgba(88, 85, 85, 0.21) 3.46%, rgba(87, 79, 79, 0.21) 99.5%)',
      },
      colors: {
        "white-primary": "#FFFFFF",
        "violet-primary": "#7E3884",
        "white-secondary": "#5c6ac4",
        "gray-blured": "#D9D9D9",
      },
      fontFamily: {
        mont: ["Montserrat", "sans-serif"],
      },
      screens: {
        'xs': '320px',   
        'sm': '640px',
        'md': '768px',
        'lg': '1023px',
        'xl': '1280px',
        '2xl': '1536px',
     
    },
    width: {
      'desktop': 'calc(100% - 100px)',
      'phone': 'calc(100% - 112px)',
    },
    height: {
      'desktop': 'calc(100% - 112px)',
      'phone': 'calc(100% - 112px)',
    },
    fontSize: {
      '2xs': '0.625rem', // Example for extra small text
    },
    keyframes: {
      fadeInLetter: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
    },
    animation: {
      'fade-in-letter': 'fadeInLetter 0.08s ease-in-out forwards', 
    },
  },
  },
  plugins: [],
};

export default config;
