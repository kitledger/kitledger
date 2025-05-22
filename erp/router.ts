import { type Context, Hono } from '@hono/hono';
import UnitTypeRouter from './handlers/unit_type_api_handler.ts';
import LedgerRouter from './handlers/ledger_api_handler.ts';
import AccountRouter from './handlers/account_api_handler.ts';
import EntityModelRouter from './handlers/entity_model_api_handler.ts';
import TransactionModelRouter from './handlers/transaction_model_api_handler.ts';

const app = new Hono();

app.get('/health', (c: Context) => {
	return c.json({ status: 'ok' });
});

app.route('/api/accounts', AccountRouter);
app.route('/api/unit-types', UnitTypeRouter);
app.route('/api/ledgers', LedgerRouter);
app.route('/api/entity-models', EntityModelRouter);
app.route('/api/transaction-models', TransactionModelRouter);

// Export to use instance in testing client.
export const server = app;
