import { assertEquals } from '@std/assert/equals';
import { server } from '../../erp/router.ts';
import { UnitTypeFactory } from '../../core/services/database/factories.ts';
import { NewUnitType, UnitType } from '../../core/types/index.ts';

async function makeRequest(data: NewUnitType | UnitType, method: string, endpoint: string): Promise<Response> {
	const req = new Request(
		`http://localhost:${Deno.env.get('KL_SERVER_PORT')}${endpoint}`,
		{
			method: method,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		},
	);

	return await server.fetch(req);
}

const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 99)}`;

Deno.test({
	name: 'Create a valid unit type',
	async fn() {
		const test_data = (new UnitTypeFactory()).make();
		test_data.ref_id = SUCCESS_REF_ID;

		const res = await makeRequest(test_data, 'POST', '/api/unit-types');
		const json: UnitType = await res.json();

		assertEquals(res.status, 200);
		assertEquals(json.id.length, 36);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Invalid name fails validation',
	async fn() {
		const test_data = (new UnitTypeFactory()).make();
		test_data.name = 'A'.repeat(256);

		const res = await makeRequest(test_data, 'POST', '/api/unit-types');

		assertEquals(res.status, 422);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Repeated Ref ID fails validation',
	async fn() {
		const test_data = (new UnitTypeFactory()).make();
		test_data.ref_id = SUCCESS_REF_ID;

		const res = await makeRequest(test_data, 'POST', '/api/unit-types');

		assertEquals(res.status, 422);
	},
	sanitizeOps: false,
});
