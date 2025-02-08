import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {

            // Style code blocks with JetBrains Mono
            'pre, code': {
              fontFamily: 'JetBrains Mono, monospace',
            },
            // Style headings
            'h1, h2, h3, h4': {
              fontFamily: 'Inter, sans-serif',
              fontWeight: '600',
            },
            // Adjust code block background
            'pre': {
              backgroundColor: 'var(--tw-prose-pre-bg)',
              color: 'var(--tw-prose-pre-code)',
            },
            // Style inline code
            'code': {
              backgroundColor: 'var(--tw-prose-pre-bg)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
          },
        },
      },
    },
  },
};

export default config; 