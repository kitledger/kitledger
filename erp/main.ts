import { createServer } from './server.ts';
import { createDatabase } from '../core/services/database/db.ts';
import { postgresUrl, postgresConfig } from './config.ts';

const port = Number(Deno.env.get('KL_SERVER_PORT') || 3000);
console.log(`Server is running on port ${port}`);

const dbEngine = createDatabase({
  postgresUrl,
  maxConnections: postgresConfig.max_connections,
});

await dbEngine.migrateDb();

export type KitledgerDatabase = typeof dbEngine.db;

const server = createServer({
  database: dbEngine.db,
});

Deno.serve({ port }, server.fetch);
