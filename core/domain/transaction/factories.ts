import { faker } from "@faker-js/faker";
import type { TransactionModel } from "./types.ts";
import { BaseFactory } from "../base/base_factory.ts";

export class TransactionModelFactory extends BaseFactory<TransactionModel> {
	constructor() {
		super(makeTransactionModel);
	}
}

const makeTransactionModel = (): TransactionModel => ({
	id: faker.string.uuid(),
	ref_id: `txn_${faker.string.alphanumeric(12)}`,
	name: faker.finance.transactionType(),
	alt_id: faker.datatype.boolean() ? faker.string.alphanumeric(8) : null,
	active: faker.datatype.boolean(),
	created_at: faker.date.past(),
	updated_at: faker.date.recent(),
});
