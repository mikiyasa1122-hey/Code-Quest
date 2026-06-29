import { defineConfig } from "prisma/config";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function readDotEnvValue(key: string): string | undefined {
  const envPath = resolve(process.cwd(), ".env");

  if (!existsSync(envPath)) {
    return undefined;
  }

  const line = readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .find((entry) => entry.startsWith(`${key}=`));

  if (!line) {
    return undefined;
  }

  return line.slice(key.length + 1).trim().replace(/^["']|["']$/g, "");
}

function getDatabaseUrl(): string {
  return (
    process.env.DATABASE_URL ??
    readDotEnvValue("DATABASE_URL") ??
    "postgresql://postgres:postgres@localhost:5432/code_quest?schema=public"
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  engine: "classic",
  datasource: {
    url: getDatabaseUrl()
  },
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts"
  }
});
