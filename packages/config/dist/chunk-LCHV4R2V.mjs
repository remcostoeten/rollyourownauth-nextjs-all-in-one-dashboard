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

export { eslintConfig };
//# sourceMappingURL=chunk-LCHV4R2V.mjs.map
//# sourceMappingURL=chunk-LCHV4R2V.mjs.map