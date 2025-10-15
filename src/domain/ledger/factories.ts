import { faker } from "@faker-js/faker";
import { randomUUIDv7 } from "bun";
import type { Account, Ledger } from "./types.ts";
import { BaseFactory } from "../base/base_factory.ts";
import { BalanceType } from "./types.ts";

export class LedgerFactory extends BaseFactory<Ledger> {
	constructor() {
		super(makeLedger);
	}
}

export class AccountFactory extends BaseFactory<Account> {
	constructor() {
		super(makeAccount);
	}
}

const makeLedger = (): Ledger => ({
	id: randomUUIDv7(),
	ref_id: randomUUIDv7(),
	alt_id: randomUUIDv7(),
	unit_model_id: randomUUIDv7(),
	name: faker.company.name(),
	description: faker.company.catchPhrase(),
	active: true,
	created_at: faker.date.past(),
	updated_at: faker.date.recent(),
});

const makeAccount = (): Account => ({
	id: randomUUIDv7(),
	ref_id: randomUUIDv7(),
	alt_id: randomUUIDv7(),
	name: faker.finance.accountName(),
	balance_type: faker.helpers.arrayElement(Object.values(BalanceType)),
	ledger_id: randomUUIDv7(),
	parent_id: randomUUIDv7(),
	active: true,
	created_at: faker.date.past(),
	updated_at: faker.date.recent(),
	meta: {},
});
