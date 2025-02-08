g;module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    "@typescript-eslint/no-empty-object-type": ["error", {
      allowObjectTypes: true
    }],
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      { prefer: "type-imports", fixStyle: "inline-type-imports" }
    ],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
  }
}; 