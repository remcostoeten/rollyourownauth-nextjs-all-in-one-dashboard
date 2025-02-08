'use strict';

var defaultTheme = require('tailwindcss/defaultTheme');

var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var tailwindConfig = {
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
        sans: ["Inter", ...defaultTheme.fontFamily.sans]
      },
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49"
        },
        dark: {
          100: "#1e1e1e",
          200: "#2d2d2d",
          300: "#3c3c3c",
          400: "#4b4b4b",
          500: "#5a5a5a"
        },
        light: {
          100: "#ffffff",
          200: "#fafafa",
          300: "#f5f5f5",
          400: "#f0f0f0",
          500: "#e5e5e5"
        }
      }
    }
  },
  plugins: [
    __require("@tailwindcss/typography"),
    __require("tailwindcss-animate")
  ]
};

exports.tailwindConfig = tailwindConfig;
//# sourceMappingURL=tailwind.js.map
//# sourceMappingURL=tailwind.js.map