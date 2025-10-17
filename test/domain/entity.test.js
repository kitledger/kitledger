import { describe, it, afterAll, expect } from "vitest";
import { db } from "../../src/services/database/db.js";
import { createEntityModel } from "../../src/domain/entity/entity_model_actions.js";
import { EntityModelFactory } from "../../src/domain/entity/factories.js";
describe("Entity Domain Tests", () => {
    /*afterAll(async () => {
        // Close up Drizzle DB Connection
        await db.$client.end();
    });*/
    it("Can create a valid entity model", async () => {
        const entityModelFactory = new EntityModelFactory();
        const entityModelData = entityModelFactory.make(1)[0];
        if (!entityModelData) {
            throw new Error("Failed to create Entity Model data");
        }
        entityModelData.active = true;
        const entityModelResult = await createEntityModel(entityModelData);
        if (entityModelResult.success === false) {
            throw new Error("Failed to create Entity Model");
        }
        expect(entityModelResult.success).toBe(true);
    });
    it("Applies entity model validation correctly", async () => {
        const entityModelFactory = new EntityModelFactory();
        const entityModelData = entityModelFactory.make(1)[0];
        if (!entityModelData) {
            throw new Error("Failed to create Entity Model data");
        }
        const entityModelResult = await createEntityModel(entityModelData);
        if (entityModelResult.success === false) {
            throw new Error("Failed to create Entity Model");
        }
        const missingNameEntityModel = entityModelFactory.make(1)[0];
        if (!missingNameEntityModel) {
            throw new Error("Failed to create Entity Model data for missing name test");
        }
        missingNameEntityModel.name = "";
        const missingNameEntityModelResult = await createEntityModel(missingNameEntityModel);
        expect(missingNameEntityModelResult.success).toBe(false);
        const duplicateIdsEntityModel = entityModelFactory.make(1)[0];
        if (!duplicateIdsEntityModel) {
            throw new Error("Failed to create Entity Model data for duplicate IDs test");
        }
        duplicateIdsEntityModel.id = entityModelResult.data.id;
        duplicateIdsEntityModel.ref_id = entityModelResult.data.ref_id;
        duplicateIdsEntityModel.alt_id = entityModelResult.data.alt_id;
        const duplicateIdsEntityModelResult = await createEntityModel(duplicateIdsEntityModel);
        expect(duplicateIdsEntityModelResult.success).toBe(false);
    });
});
