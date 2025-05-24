import { type Context, Hono } from 'hono';
import { createUnitTypeRouter } from './routers/unit_type_router.js';
import { createLedgerRouter } from './routers/ledger_router.js';
import { createAccountRouter } from './routers/account_router.js';
import {createEntityModelRouter } from './routers/entity_model_router.js';
import { createTransactionModelRouter } from './routers/transaction_model_router.js';
import type { KitledgerDatabase } from '../core/services/database/db.js';

export type ServerConfig = {
	database: KitledgerDatabase;
}

export function createServer() {
	const app = new Hono();

	app.get('/health', (c: Context) => {
		return c.json({ status: 'ok' });
	});

	app.route('/api/accounts', createAccountRouter());
	app.route('/api/unit-types', createUnitTypeRouter());
	app.route('/api/ledgers', createLedgerRouter());
	app.route('/api/entity-models', createEntityModelRouter());
	app.route('/api/transaction-models', createTransactionModelRouter());

	return app;
}
