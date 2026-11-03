/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Brand green (matches the Ridezy logo / illustration)
        brand: {
          50: "#ECFDF3",
          100: "#D1FADF",
          200: "#A6F4C5",
          300: "#6CE9A6",
          400: "#32D583",
          500: "#12B76A",
          600: "#039855",
          700: "#027A48",
          800: "#05603A",
          900: "#054F31",
        },
        // Neutral "ink" scale used for text, surfaces and dark cards
        ink: {
          50: "#F8FAFC",
          100: "#F2F4F7",
          200: "#E4E7EC",
          300: "#D0D5DD",
          400: "#98A2B3",
          500: "#667085",
          600: "#475467",
          700: "#344054",
          800: "#1D2939",
          900: "#0B1220",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,0.04), 0 4px 16px rgba(16,24,40,0.06)",
        sheet: "0 -8px 32px rgba(16,24,40,0.12)",
        float: "0 8px 24px rgba(16,24,40,0.14)",
        brand: "0 8px 20px -6px rgba(18,183,106,0.55)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.92)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        radar: {
          "0%": { transform: "scale(0.6)", opacity: "0.7" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        progress: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(250%)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.45s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.3s ease-out both",
        "pop-in": "pop-in 0.3s cubic-bezier(0.22,1,0.36,1) both",
        radar: "radar 2.2s cubic-bezier(0,0,0.2,1) infinite",
        progress: "progress 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
