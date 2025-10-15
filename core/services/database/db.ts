import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { dbConfig } from "../../config.ts";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url"; 
import * as schema from "./schema.ts";

export const db = drizzle({
    connection: dbConfig,
    schema: schema,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const migrationsPath = join(__dirname, "migrations");

export async function runMigrations() {
    await migrate(db, {
        migrationsFolder: migrationsPath,
        migrationsTable: "schema_history",
        migrationsSchema: "public",
    });
}