import { faker } from "@faker-js/faker";
import { v7 } from "uuid";
import { Account } from "../types/account_types.js";
import { Ledger } from "../types/ledger_types.js";
import { BaseFactory } from "../factories/base_factory.js";
import { BalanceType } from "../types/account_types.js";

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
	id: v7(),
	ref_id: v7(),
	alt_id: v7(),
	unit_model_id: v7(),
	name: faker.company.name(),
	description: faker.company.catchPhrase(),
	active: true,
	created_at: faker.date.past(),
	updated_at: faker.date.recent(),
});

const makeAccount = (): Account => ({
	id: v7(),
	ref_id: v7(),
	alt_id: v7(),
	name: faker.finance.accountName(),
	balance_type: faker.helpers.arrayElement(Object.values(BalanceType)),
	ledger_id: v7(),
	parent_id: v7(),
	active: true,
	created_at: faker.date.past(),
	updated_at: faker.date.recent(),
	meta: {},
});
