export const siteConfig: SiteConfig = {
  name: {
    name: "Roll your own auth",
    nameStripped: "Rollyourownauth",
    short: "RYOA",
  },
  shortName: "RYOA",
  
  url: "https://docs.rollyourownauth.remcostoeten.com ",
  docsUrl: "https://docs.rollyourownauth.remcostoeten.com", 
  description: "A custom-rolled authentication solution with JWT, sessions, and modular architecture",
  githubUrl: "https://github.com/remcostoeten/ryoa-mono-docs",
  
  author: {
    name: "Remco Stoeten",
    url: "https://remcostoeten.com",
    github: "remcostoeten",
    twitter: "yowremco",
  },
  // Open Graph / Social
  // ogImage: "https://rollyourownauth.dev/og.png",
  // twitter: {
    
  //   card: "summary_large_image",
  //   creator: "@remcostoeten",
  // },
  
  // Project metadata
  version: "0.1.0",
  license: "MIT",
  repository: {
    type: "git",
    url: "https://github.com/remcostoeten/ryoa-mono-docs.git",
  },
  
  // Documentation settings
  docs: {
    title: "RollYourOwnAuth Documentation",
    description: "Learn how to implement custom authentication in your Next.js applications",
    repository: "https://github.com/remcostoeten/rollyourownauth/tree/main/apps/documentation",
  },
} as const;


export type SiteConfig = {
  name: {
    name: string;
    nameStripped: string;
    short: string;
  };
  shortName: string;
  description: string;
  url: string;
  docsUrl: string;
  githubUrl: string;
  author: {
    name: string;
    url: string;
    github: string;
    twitter?: string;
  };
  ogImage?: string;
  twitter?: {
    card: string;
    creator: string;
  };
  version: string;
  license: string;
  repository: {
    type: string;
    url: string;
  };
  docs: {
    title: string;
    description: string;
    repository: string;
  };
};
