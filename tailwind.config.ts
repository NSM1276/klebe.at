import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111214",
        panel: "#1b1c1f",
        accent: "#ff6a1a",
      },
    },
  },
  plugins: [],
};

export default config;
