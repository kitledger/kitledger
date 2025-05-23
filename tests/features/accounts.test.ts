import { assertEquals } from '@std/assert/equals';
import { server } from '../../erp/server.ts';
import { AccountFactory, LedgerFactory, UnitTypeFactory } from '../../core/services/database/factories.ts';
import { create } from '../../core/actions/ledger_actions.ts';
import { create as createUnitType } from '../../core/actions/unit_type_actions.ts';
import { Account, NewAccount } from '../../core/types/index.ts';

const sample_ledger_data = (new LedgerFactory()).make();
const uom_type = await createUnitType(
	(new UnitTypeFactory()).make(),
);
sample_ledger_data.unit_type_id = uom_type[0].id;
const ledger = await create(sample_ledger_data);

async function makeRequest(
	data: NewAccount | Account,
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
	name: 'Create a valid account',
	async fn() {
		const test_data = (new AccountFactory()).make();
		test_data.ref_id = SUCCESS_REF_ID;
		test_data.ledger_id = ledger[0].id;

		const res = await makeRequest(test_data, 'POST', '/api/accounts');
		const json: Account = await res.json();

		assertEquals(res.status, 200);
		assertEquals(json.id.length, 36);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Invalid name fails validation',
	async fn() {
		const test_data = (new AccountFactory()).make();
		test_data.name = 'A'.repeat(256);
		test_data.ledger_id = ledger[0].id;

		const res = await makeRequest(test_data, 'POST', '/api/accounts');

		assertEquals(res.status, 422);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Repeated Ref ID fails validation',
	async fn() {
		const test_data = (new AccountFactory()).make();
		test_data.ref_id = SUCCESS_REF_ID;
		test_data.ledger_id = ledger[0].id;

		const res = await makeRequest(test_data, 'POST', '/api/accounts');

		assertEquals(res.status, 422);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});
