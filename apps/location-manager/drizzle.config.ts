import { env } from "@/env"
import type { Config } from "drizzle-kit"

export default {
  schema: "./src/server/db/schema/index.ts",
  out: "./src/server/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DATABASE_URL.replace("file:", ""),
  },
  verbose: true,
  strict: true,
} satisfies Config

