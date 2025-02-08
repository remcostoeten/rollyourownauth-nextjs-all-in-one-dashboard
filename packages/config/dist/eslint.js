'use strict';

// src/eslint.ts
var eslintConfig = {
  extends: [
    "next/core-web-vitals",
    "prettier"
  ],
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      { prefer: "type-imports", fixStyle: "inline-type-imports" }
    ],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
  }
};

exports.eslintConfig = eslintConfig;
//# sourceMappingURL=eslint.js.map
//# sourceMappingURL=eslint.js.map