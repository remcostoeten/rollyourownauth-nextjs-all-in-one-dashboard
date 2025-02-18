import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/modules/auth/api/schemas/*",
  out: "./drizzle",
  dbCredentials: {
    url: "local.db", 
  }
});