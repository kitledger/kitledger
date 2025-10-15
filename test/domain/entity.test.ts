import { describe, it, afterAll, expect } from "bun:test";
import { db } from "../../src/services/database/db.ts";
import { createEntityModel } from "../../src/domain/entity/entity_model_actions.ts";
import { EntityModelFactory } from "../../src/domain/entity/factories.ts";

describe("Entity Domain Tests", () => {
	/*afterAll(async () => {
		// Close up Drizzle DB Connection
		await db.$client.end();
	});*/

	it("Can create a valid entity model", async () => {
		const entityModelFactory = new EntityModelFactory();
		const entityModelData = entityModelFactory.make(1)[0];
		entityModelData.active = true;
		const entityModelResult = await createEntityModel(entityModelData);

		if (entityModelResult.success === false) {
			throw new Error("Failed to create Entity Model");
		}

		expect(entityModelResult.success).toBe(true);
	});

	it("Applies entity model validation correctly", async() => {
		const entityModelFactory = new EntityModelFactory();
		const entityModelData = entityModelFactory.make(1)[0];
		const entityModelResult = await createEntityModel(entityModelData);

		if (entityModelResult.success === false) {
			throw new Error("Failed to create Entity Model");
		}

		const missingNameEntityModel = entityModelFactory.make(1)[0];
		missingNameEntityModel.name = "";
		const missingNameEntityModelResult = await createEntityModel(missingNameEntityModel);

		expect(missingNameEntityModelResult.success).toBe(false);

		const duplicateIdsEntityModel = entityModelFactory.make(1)[0];
		duplicateIdsEntityModel.id = entityModelResult.data.id;
		duplicateIdsEntityModel.ref_id = entityModelResult.data.ref_id;
		duplicateIdsEntityModel.alt_id = entityModelResult.data.alt_id;
		const duplicateIdsEntityModelResult = await createEntityModel(duplicateIdsEntityModel);

		expect(duplicateIdsEntityModelResult.success).toBe(false);
	});
});