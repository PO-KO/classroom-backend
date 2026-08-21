import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DB_URL) {
  throw new Error("DB_URL is not set in the .env file");
}

export default defineConfig({
  schema: "./src/db/index.ts", // Your schema file path
  out: "./drizzle", // Your migrations folder
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL,
  },
});
