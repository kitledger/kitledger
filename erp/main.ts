import { server } from './router.ts';
import { migrateDb } from '../core/services/database/db.ts';

const port = Number(Deno.env.get('KL_SERVER_PORT') || 3000);
console.log(`Server is running on port ${port}`);

await migrateDb();

Deno.serve({ port }, server.fetch);
