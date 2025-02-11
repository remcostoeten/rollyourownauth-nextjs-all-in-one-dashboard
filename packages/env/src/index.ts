import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const createAppEnv = () =>
  createEnv({
    server: {
      DATABASE_URL: z.string().min(1).default("file:local.db"),
      JWT_SECRET: z.string().min(1),
    },
    // Add any client-side env variables here if needed
    client: {
      // Example: PUBLIC_API_URL: z.string().min(1),
    },
    // If you're using Next.js 13.4.4+, you only need to destructure client variables
    experimental__runtimeEnv: {
      // Example: PUBLIC_API_URL: process.env.PUBLIC_API_URL,
    },
  });

export type Env = ReturnType<typeof createAppEnv>;
