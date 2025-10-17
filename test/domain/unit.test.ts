import { describe, it, afterAll, expect } from "vitest";
import { db } from "../../src/services/database/db.js";
import { UnitModelFactory } from "../../src/domain/unit/factories.js";
import { createUnitModel } from "../../src/domain/unit/unit_model_actions.js";

describe("Unit Domain Tests", () => {
	/*afterAll(async () => {
		// Close up Drizzle DB Connection
		await db.$client.end();
	});*/

	it("Can create a valid unit model", async () => {
		const unitModelFactory = new UnitModelFactory();
		const unitModelData = unitModelFactory.make(1)[0];

		if(!unitModelData) {
			throw new Error("Failed to create Unit Model data");
		}

		unitModelData.active = true;
		const unitModelResult = await createUnitModel(unitModelData);

		if (unitModelResult.success === false) {
			throw new Error("Failed to create Unit Model");
		}

		expect(unitModelResult.success).toBe(true);
	});

	it("Applies unit model validation correctly", async() => {
		const unitModelFactory = new UnitModelFactory();
		const unitModelData = unitModelFactory.make(1)[0];

		if(!unitModelData) {
			throw new Error("Failed to create Unit Model data");
		}

		const unitModelResult = await createUnitModel(unitModelData);

		if (unitModelResult.success === false) {
			throw new Error("Failed to create Unit Model");
		}

		const missingNameUnitModel = unitModelFactory.make(1)[0];

		if(!missingNameUnitModel) {
			throw new Error("Failed to create Unit Model data for missing name test");
		}

		missingNameUnitModel.name = "";
		const missingNameUnitModelResult = await createUnitModel(missingNameUnitModel);

		expect(missingNameUnitModelResult.success).toBe(false);

		const duplicateIdsUnitModel = unitModelFactory.make(1)[0];

		if(!duplicateIdsUnitModel) {
			throw new Error("Failed to create Unit Model data for duplicate IDs test");
		}

		duplicateIdsUnitModel.id = unitModelResult.data.id;
		duplicateIdsUnitModel.ref_id = unitModelResult.data.ref_id;
		duplicateIdsUnitModel.alt_id = unitModelResult.data.alt_id;
		const duplicateIdsUnitModelResult = await createUnitModel(duplicateIdsUnitModel);

		expect(duplicateIdsUnitModelResult.success).toBe(false);
	});
});