export const eslintConfig = {
  extends: [
    'next/core-web-vitals',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
} as const; 