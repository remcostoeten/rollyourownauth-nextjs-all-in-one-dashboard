import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { siteConfig } from "../../../packages/configuration/site-config";
/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: siteConfig.name.name,
  },
  links: [
    {
      text: "Documentation",
      url: "/docs",
      active: "nested-url",
    },
  ],
};
