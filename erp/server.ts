import { type Context, Hono } from 'hono';
import { createUnitTypeRouter } from './handlers/unit_type_handler.js';
import { createLedgerRouter } from './handlers/ledger_handler.js';
import { createAccountRouter } from './handlers/account_handler.js';
import {createEntityModelRouter } from './handlers/entity_model_handler.js';
import { createTransactionModelRouter } from './handlers/transaction_model_handler.js';
import { type KitledgerDatabase } from './main.js';

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
