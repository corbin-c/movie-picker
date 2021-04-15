module.exports = {
 purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or "media" or "class"
  theme: {
    scale: {
      "x": "-1",
    },
    extend: {
      spacing: {
        "13": "3.25rem",
        "26": "6.5rem",
      },
      inset: {
        "15": "3.75rem",
      },
      minWidth: {
        "16": "16.67%",
      }
    },
  },
  variants: {
    backgroundColor: ["even", "active", "hover", "focus"],
    borderColor: ["active", "hover", "focus"],
    textColor: ["active", "hover", "focus", "group-hover"],
    translate: ["group-hover"],
  },
  plugins: [],
}
