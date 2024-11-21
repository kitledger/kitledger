import { server } from './interfaces/http/http.ts';

const port = Number(Deno.env.get('KL_SERVER_PORT') || 3000);
console.log(`Server is running on port ${port}`);

Deno.serve({ port }, server.fetch);
