import { serve } from '@hono/node-server'
import { createServer } from './server.js';
import { createDatabase } from '../core/services/database/db.js';
import { postgresUrl, postgresConfig } from './config.js';

const port = Number(process.env.KL_SERVER_PORT || 3000);
console.log(`Server is running on port ${port}`);

const dbEngine = createDatabase({
  postgresUrl,
  maxConnections: postgresConfig.max_connections,
});

await dbEngine.migrateDb();

const server = createServer();

serve({
	fetch: server.fetch,
	port: port,
});
