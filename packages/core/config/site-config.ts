export const siteConfig = {
    name: {
        short: "RYOA",
        long: "Roll your own auth",
        noSpaces: "rollyourownauth",
    },

    description: "A custom-rolled authentication solution with JWT, sessions, and modular architecture",
    

    // URLs
    url: "https://rollyourownauth.dev",
    docsUrl: "https://docs.rollyourownauth.dev",
    githubUrl: "https://github.com/remcostoeten/rollyourownauth",
    
    // Author information
    author: {
      name: "Remco Stoeten",
      url: "https://remcostoeten.com",
      github: "remcostoeten",
      twitter: "@remcostoeten",
    },
    
    // Open Graph / Social
    ogImage: "https://rollyourownauth.dev/og.png",
    twitter: {
      card: "summary_large_image",
      creator: "@remcostoeten",
    },
  
    // Project metadata
    version: "0.1.0",
    license: "MIT",
    repository: {
      type: "git",
      url: "https://github.com/remcostoeten/rollyourownauth.git",
    },
  
    // Documentation settings
    docs: {
      title: "RollYourOwnAuth Documentation",
      description: "Learn how to implement custom authentication in your Next.js applications",
      repository: "https://github.com/remcostoeten/rollyourownauth/tree/main/apps/documentation",
    },
  
    // Features and capabilities
    features: [
      "Custom JWT Implementation",
      "Session Management",
      "OAuth Integration",
      "Type-safe Database Layer",
      "Modular Architecture",
    ],
  
    // Keywords for SEO
    keywords: [
      "authentication",
      "authorization",
      "jwt",
      "oauth",
      "nextjs",
      "react",
      "typescript",
      "drizzle-orm",
    ],
  } as const;
  
  // Derive types from the config
  export type SiteConfig = typeof siteConfig;
  
  // Export specific types that might be useful
  export type NavItem = {
    title: string;
    href: string;
    disabled?: boolean;
    external?: boolean;
    label?: string;
  };
  
  // Example navigation items using the config
  export const mainNav: NavItem[] = [
    {
      title: "Documentation",
      href: siteConfig.docsUrl,
    },
    {
      title: "GitHub",
      href: siteConfig.githubUrl,
      external: true,
    },
  ];
  
  // Theme configuration
  export const themeConfig = {
    // Light theme colors
    light: {
      background: "white",
      foreground: "black",
      primary: "#0ea5e9",
      secondary: "#6366f1",
      muted: "#f3f4f6",
    },
    // Dark theme colors
    dark: {
      background: "#1e1e1e",
      foreground: "white",
      primary: "#38bdf8",
      secondary: "#818cf8",
      muted: "#2d2d2d",
    },
  } as const; 