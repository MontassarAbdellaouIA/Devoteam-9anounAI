import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can define the Devoteam red here if you want to use 'bg-devoteam' instead of 'bg-[#F8485E]' later
        devoteam: "#F8485E", 
      },
    },
  },
  plugins: [],
};

export default config;