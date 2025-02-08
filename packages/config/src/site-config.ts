export const siteConfig = {
  name: "RollYourOwnAuth",
  shortName: "RYOA",
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
} as const; 