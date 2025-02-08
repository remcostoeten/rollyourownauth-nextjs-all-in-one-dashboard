import { siteConfig } from '../../../packages/core/config/site-config'

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const navConfig = {
  enableSearch: true,
  title: siteConfig.name,
  transparentMode: 'top',
} as const;

export const layoutConfig = {
  nav: {
    title: siteConfig.name,
  },
  links: [
    {
      text: 'Documentation',
      url: '/docs',
      active: 'nested-url',
    },
    {
      text: 'API',
      url: '/api',
      active: 'nested-url',
    },
  ],
} as const;