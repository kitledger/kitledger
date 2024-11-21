import { defineConfig } from 'drizzle-kit';

const user = Deno.env.get('KL_DB_USER') || '';
const password = Deno.env.get('KL_DB_PASSWORD') || '';
const host = Deno.env.get('KL_DB_HOST') || 'localhost';
const port = parseInt(Deno.env.get('KL_DB_PORT') || '5432');
const database = Deno.env.get('KL_DB_NAME') || 'kitledger';

export const postgresUrl =
	`postgres://${user}:${password}@${host}:${port}/${database}`;

export default defineConfig({
	dbCredentials: {
		url: postgresUrl,
	},
	schema: './infrastructure/database/schema.ts',
	out: './infrastructure/database/migrations',
	dialect: 'postgresql',
	verbose: true,
	strict: true,
});
