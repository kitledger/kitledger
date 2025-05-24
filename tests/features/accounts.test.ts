import { describe, test, expect } from 'vitest';
import { createServer } from '../../erp/server';
import { createDatabase } from '../../core/services/database/db';
import { postgresUrl, postgresConfig } from '../../erp/config';
import { AccountFactory, LedgerFactory, UnitTypeFactory } from '../../core/services/database/factories';
import { create as createLedger } from '../../core/actions/ledger_actions';
import { create as createUnitType } from '../../core/actions/unit_type_actions';
import type { Account, NewAccount } from '../../core/types/index';

createDatabase({
	postgresUrl,
	maxConnections: postgresConfig.max_connections,
});
const server = createServer();

const sample_ledger_data = (new LedgerFactory()).make();
const uom_type_array = await createUnitType(
    (new UnitTypeFactory()).make(),
);
sample_ledger_data.unit_type_id = uom_type_array[0].id; // Assuming uom_type_array[0] exists and has an id
const created_ledger_array = await createLedger(sample_ledger_data);
const ledger = created_ledger_array[0]; // Assuming created_ledger_array[0] exists and has an id

async function makeRequest(
    data: NewAccount | Partial<Account>,
    method: string,
    endpoint: string,
): Promise<Response> {
    const port = process.env.KL_SERVER_PORT || '8000';
    const url = `http://localhost:${port}${endpoint}`;
    const req = new Request(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return await server.fetch(req);
}

const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 9999)}`;

// Using .sequential to maintain similar execution order to Deno's default for interdependent tests.
describe.sequential('Account API', () => {
    test('Create a valid account', async () => {
        const accountPayload = (new AccountFactory()).make();
        accountPayload.ref_id = SUCCESS_REF_ID;
        accountPayload.ledger_id = ledger.id;

        const res = await makeRequest(accountPayload, 'POST', '/api/accounts');
        const json: Account = await res.json();

        expect(res.status).toBe(200);
        expect(json.id).toHaveLength(36);
    });

    test('Invalid name fails validation', async () => {
        const accountPayload = (new AccountFactory()).make();
        accountPayload.name = 'A'.repeat(256);
        accountPayload.ledger_id = ledger.id;

        const res = await makeRequest(accountPayload, 'POST', '/api/accounts');

        expect(res.status).toBe(422);
    });

    test('Repeated Ref ID fails validation', async () => {
        const accountPayload = (new AccountFactory()).make();
        accountPayload.ref_id = SUCCESS_REF_ID;
        accountPayload.ledger_id = ledger.id;

        const res = await makeRequest(accountPayload, 'POST', '/api/accounts');

        expect(res.status).toBe(422);
    });
});