import { describe, it, afterAll, expect } from "vitest";
import { db } from "../../src/services/database/db.js";
import { createTransactionModel } from "../../src/domain/transaction/transaction_model_actions.js";
import { TransactionModelFactory } from "../../src/domain/transaction/factories.js";

describe("Transaction Domain Tests", () => {
	/*afterAll(async () => {
		// Close up Drizzle DB Connection
		await db.$client.end();
	});*/

	it("Can create a valid transaction model", async () => {
		const transactionModelFactory = new TransactionModelFactory();
		const transactionModelData = transactionModelFactory.make(1)[0];

		if(!transactionModelData) {
			throw new Error("Failed to create Transaction Model data");
		}

		transactionModelData.active = true;
		const transactionModelResult = await createTransactionModel(transactionModelData);

		if (transactionModelResult.success === false) {
			throw new Error("Failed to create Transaction Model");
		}

		expect(transactionModelResult.success).toBe(true);
	});

	it("Applies transaction model validation correctly", async() => {
		const transactionModelFactory = new TransactionModelFactory();
		const transactionModelData = transactionModelFactory.make(1)[0];

		if(!transactionModelData) {
			throw new Error("Failed to create Transaction Model data");
		}

		const transactionModelResult = await createTransactionModel(transactionModelData);

		if (transactionModelResult.success === false) {
			throw new Error("Failed to create Transaction Model");
		}

		const missingNameTransactionModel = transactionModelFactory.make(1)[0];

		if(!missingNameTransactionModel) {
			throw new Error("Failed to create Transaction Model data for missing name test");
		}

		missingNameTransactionModel.name = "";
		const missingNameTransactionModelResult = await createTransactionModel(missingNameTransactionModel);

		expect(missingNameTransactionModelResult.success).toBe(false);

		const duplicateIdsTransactionModel = transactionModelFactory.make(1)[0];

		if(!duplicateIdsTransactionModel) {
			throw new Error("Failed to create Transaction Model data for duplicate IDs test");
		}

		duplicateIdsTransactionModel.id = transactionModelResult.data.id;
		duplicateIdsTransactionModel.ref_id = transactionModelResult.data.ref_id;
		duplicateIdsTransactionModel.alt_id = transactionModelResult.data.alt_id;
		const duplicateIdsTransactionModelResult = await createTransactionModel(duplicateIdsTransactionModel);

		expect(duplicateIdsTransactionModelResult.success).toBe(false);
	});
});