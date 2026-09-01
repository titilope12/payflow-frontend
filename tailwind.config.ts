import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0e14",
        panel: "#151a23",
        edge: "#232b38",
        muted: "#8b97a8",
        accent: "#3ddc97",
      },
    },
  },
  plugins: [],
} satisfies Config;
