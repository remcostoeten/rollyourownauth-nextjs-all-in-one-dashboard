export const env = {
	DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
	NODE_ENV: process.env.NODE_ENV || "development",
} as const;
