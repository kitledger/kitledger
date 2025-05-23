import { assertEquals } from '@std/assert/equals';
import { server } from '../../erp/server.ts';
import { LedgerFactory, UnitTypeFactory } from '../../core/services/database/factories.ts';
import { create } from '../../core/actions/unit_type_actions.ts';
import { Ledger, NewLedger } from '../../core/types/index.ts';

const uom_type = await create(
	(new UnitTypeFactory()).make(),
);

async function makeRequest(
	data: NewLedger | Ledger,
	method: string,
	endpoint: string,
): Promise<Response> {
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
	name: 'Create a valid ledger',
	async fn() {
		const test_data = (new LedgerFactory()).make();
		test_data.ref_id = SUCCESS_REF_ID;
		test_data.unit_type_id = uom_type[0].id;

		const res = await makeRequest(test_data, 'POST', '/api/ledgers');
		const json: Ledger = await res.json();

		assertEquals(res.status, 200);
		assertEquals(json.id.length, 36);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Invalid name fails validation',
	async fn() {
		const test_data = (new LedgerFactory()).make();
		test_data.name = 'A'.repeat(256);
		test_data.unit_type_id = uom_type[0].id;

		const res = await makeRequest(test_data, 'POST', '/api/ledgers');

		assertEquals(res.status, 422);
	},
	sanitizeOps: false,
});

Deno.test({
	name: 'Repeated Ref ID fails validation',
	async fn() {
		const test_data = (new LedgerFactory()).make();
		test_data.ref_id = SUCCESS_REF_ID;
		test_data.unit_type_id = uom_type[0].id;

		const res = await makeRequest(test_data, 'POST', '/api/ledgers');

		assertEquals(res.status, 422);
	},
	sanitizeOps: false,
});
