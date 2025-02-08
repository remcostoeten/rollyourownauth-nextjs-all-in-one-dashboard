import { defineConfig } from "drizzle-kit";
import { env } from "@/server/env";
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/server/db/schemas/index.ts",   
  out: "./src/server/db/migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});