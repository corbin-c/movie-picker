module.exports = {
 purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    scale: {
      "x": "-1",
    },
    extend: {},
  },
  variants: {
    backgroundColor: ["even", "active", "hover", "focus"],
    borderColor: ["active", "hover", "focus"],
    textColor: ["active", "hover", "focus", "group-hover"],
    translate: ["group-hover"],
  },
  plugins: [],
}
