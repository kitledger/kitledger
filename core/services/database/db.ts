import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from './schema.js';
import postgres from 'postgres';
import { join } from 'node:path';

export interface DatabaseConfig {
  postgresUrl: string;
  maxConnections?: number;
}

export type KitledgerDatabase = PostgresJsDatabase;

export function createDatabase(config: DatabaseConfig) {
  const { postgresUrl, maxConnections = 10 } = config;

  const queryClient = postgres(postgresUrl, { max: maxConnections });
  const db = drizzle(queryClient, { schema: schema });

  return {
    db,
    queryClient,
    async migrateDb() {
      // 'join' now refers to 'node:path.join'
      // String(import.meta.dirname) is used to ensure the first argument is a string,
      // though import.meta.dirname itself should be a string if available.
      const migrationFolder = join(String(import.meta.dirname), "./migrations");
      console.log(`Migrating database with migrations folder: ${migrationFolder}`);
      await migrate(db, {
        migrationsFolder: migrationFolder,
        migrationsTable: 'migrations',
        migrationsSchema: 'public',
      });
    },
    async close() {
      await queryClient.end();
    }
  };
}