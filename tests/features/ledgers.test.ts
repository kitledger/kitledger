import { describe, test, expect } from 'vitest';
import { createServer } from '../../erp/server';
import { createDatabase } from '../../core/services/database/db';
import { postgresUrl, postgresConfig } from '../../erp/config';
import { LedgerFactory, UnitTypeFactory } from '../../core/services/database/factories';
import { create as createUnitType } from '../../core/actions/unit_type_actions';
import type { Ledger, NewLedger, UnitType } from '../../core/types/index';

createDatabase({
	postgresUrl,
	maxConnections: postgresConfig.max_connections,
});
const server = createServer();

// Top-level await for shared setup data
const created_uom_type_array = await createUnitType(
    (new UnitTypeFactory()).make(),
);
// Assuming createUnitType returns an array and the first element is the desired UoM type.
// Also assuming the UoM type object has an 'id' property.
const uom_type = created_uom_type_array[0] as UnitType;


async function makeRequest(
    data: NewLedger | Partial<Ledger>, // Using Partial for flexibility
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
describe.sequential('Ledger API', () => {
    test('Create a valid ledger', async () => {
        const ledgerPayload = (new LedgerFactory()).make();
        ledgerPayload.ref_id = SUCCESS_REF_ID;
        ledgerPayload.unit_type_id = uom_type.id; // Use the id from the setup uom_type

        const res = await makeRequest(ledgerPayload, 'POST', '/api/ledgers');
        const json: Ledger = await res.json();

        expect(res.status).toBe(200);
        expect(json.id).toHaveLength(36);
    });

    test('Invalid name fails validation', async () => {
        const ledgerPayload = (new LedgerFactory()).make();
        ledgerPayload.name = 'A'.repeat(256);
        ledgerPayload.unit_type_id = uom_type.id;

        const res = await makeRequest(ledgerPayload, 'POST', '/api/ledgers');

        expect(res.status).toBe(422);
    });

    test('Repeated Ref ID fails validation', async () => {
        const ledgerPayload = (new LedgerFactory()).make();
        ledgerPayload.ref_id = SUCCESS_REF_ID;
        ledgerPayload.unit_type_id = uom_type.id;

        const res = await makeRequest(ledgerPayload, 'POST', '/api/ledgers');

        expect(res.status).toBe(422);
    });
});