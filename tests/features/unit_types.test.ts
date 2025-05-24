import { describe, test, expect } from 'vitest';
import { server } from '../../erp/main';
import { UnitTypeFactory } from '../../core/services/database/factories';
import type { NewUnitType, UnitType } from '../../core/types/index';

async function makeRequest(
    data: NewUnitType | Partial<UnitType>, // Using Partial for flexibility
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
describe.sequential('UnitType API', () => {
    test('Create a valid unit type', async () => {
        const unitTypePayload = (new UnitTypeFactory()).make();
        unitTypePayload.ref_id = SUCCESS_REF_ID;

        const res = await makeRequest(unitTypePayload, 'POST', '/api/unit-types');
        const json: UnitType = await res.json();

        expect(res.status).toBe(200);
        expect(json.id).toHaveLength(36);
    });

    test('Invalid name fails validation', async () => {
        const unitTypePayload = (new UnitTypeFactory()).make();
        unitTypePayload.name = 'A'.repeat(256);

        const res = await makeRequest(unitTypePayload, 'POST', '/api/unit-types');

        expect(res.status).toBe(422);
    });

    test('Repeated Ref ID fails validation', async () => {
        const unitTypePayload = (new UnitTypeFactory()).make();
        unitTypePayload.ref_id = SUCCESS_REF_ID;

        const res = await makeRequest(unitTypePayload, 'POST', '/api/unit-types');

        expect(res.status).toBe(422);
    });
});