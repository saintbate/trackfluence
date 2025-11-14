const config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "1.5rem",
      },
    },
    extend: {
      colors: {
        brand: {
          primary: "#4f46e5",
          accent: "#14b8a6",
        },
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0,0,0,0.04), 0 1px 3px 0 rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;


