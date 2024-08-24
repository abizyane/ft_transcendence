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
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
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
     
    },
  },
  plugins: [],
};

export default config;
