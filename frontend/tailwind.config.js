export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          700: "#0f4c81",
          800: "#0a3760",
          900: "#062540",
        },
        accent: "#14b8a6",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(2, 20, 38, 0.08)",
      },
    },
  },
  plugins: [],
};
