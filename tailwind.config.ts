import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    borderRadius: {
      none: "0px",
      4: "4px",
      8: "8px",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      gray: {
        900: "#101828",
        700: "#344054",
        600: "#475467",
        300: "#E5E7EB",
        100: "#F2F4F7",
        50: "#F9FAFB",
      },
      brand: {
        600: "#7F56D9",
        700: "#6941C6",
        300: "#D6BBFB",
        200: "#E9D7FE",
        100: "#F4EBFF",
        50: "#F9F5FF",
      },
    },
    fontFamily: {
      sans: ["Inter var", ...defaultTheme.fontFamily.sans],
    },
    fontSize: {
      "heading-sm": ["30px", "38px"],
      "heading-xs": ["24px", "32px"],

      md: ["14px", "20px"],
      lg: ["18px", "28px"],
    },
    fontWeight: defaultTheme.fontWeight,
    maxWidth: defaultTheme.maxWidth,
    spacing: {
      "6": "6px",
      8: "8px",
      12: "12px",
      16: "16px",
      20: "20px",
      24: "24px",
      32: "32px",
      56: "56px",
      80: "80px",
    },
  },
  plugins: [],
} satisfies Config;

export default config;
