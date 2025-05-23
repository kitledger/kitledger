import { type Context, Hono } from '@hono/hono';
import { createUnitTypeRouter } from './handlers/unit_type_handler.ts';
import { createLedgerRouter } from './handlers/ledger_handler.ts';
import { createAccountRouter } from './handlers/account_handler.ts';
import {createEntityModelRouter } from './handlers/entity_model_handler.ts';
import { createTransactionModelRouter } from './handlers/transaction_model_handler.ts';
import { type KitledgerDatabase } from './main.ts';

export type ServerConfig = {
	database: KitledgerDatabase;
}

export function createServer(config: ServerConfig) {
	const app = new Hono();

	app.get('/health', (c: Context) => {
		return c.json({ status: 'ok' });
	});

	app.route('/api/accounts', createAccountRouter(config));
	app.route('/api/unit-types', createUnitTypeRouter(config));
	app.route('/api/ledgers', createLedgerRouter(config));
	app.route('/api/entity-models', createEntityModelRouter(config));
	app.route('/api/transaction-models', createTransactionModelRouter(config));

	return app;
}
