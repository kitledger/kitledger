import { describe, it, afterAll, expect } from "vitest";
import { db } from "../../src/services/database/db.js";
import { createLedger } from "../../src/domain/ledger/ledger_actions.js";
import { createAccount } from "../../src/domain/ledger/account_actions.js";
import { LedgerFactory, AccountFactory } from "../../src/domain/ledger/factories.js";
import { UnitModelFactory } from "../../src/domain/unit/factories.js";
import { createUnitModel } from "../../src/domain/unit/unit_model_actions.js";
import { v7 } from "uuid";
describe("Ledger Domain Tests", () => {
    /*afterAll(async () => {
        // Close up Drizzle DB Connection
        await db.$client.end();
    });*/
    it("Can create a valid ledger", async () => {
        const unitModelFactory = new UnitModelFactory();
        const unitModelData = unitModelFactory.make(1)[0];
        if (!unitModelData) {
            throw new Error("Failed to create Unit Model data");
        }
        unitModelData.active = true;
        const unitModelResult = await createUnitModel(unitModelData);
        if (unitModelResult.success === false || !unitModelResult.data || !Object.keys(unitModelResult.data).includes('id')) {
            throw new Error("Failed to create Unit Model");
        }
        const ledgerFactory = new LedgerFactory();
        const ledgerData = ledgerFactory.make(1)[0];
        if (!ledgerData) {
            throw new Error("Failed to create Ledger data");
        }
        ledgerData.unit_model_id = unitModelResult.data.id;
        const ledgerResult = await createLedger(ledgerData);
        if (ledgerResult.success === false) {
            throw new Error("Failed to create Ledger");
        }
        expect(ledgerResult.success).toBe(true);
    });
    it("Applies ledger validation correctly", async () => {
        const unitModelFactory = new UnitModelFactory();
        const unitModelData = unitModelFactory.make(1)[0];
        if (!unitModelData) {
            throw new Error("Failed to create Unit Model data");
        }
        unitModelData.active = true;
        const unitModelResult = await createUnitModel(unitModelData);
        if (unitModelResult.success === false) {
            throw new Error("Failed to create Unit Model");
        }
        const ledgerFactory = new LedgerFactory();
        const ledgerData = ledgerFactory.make(1)[0];
        if (!ledgerData) {
            throw new Error("Failed to create Ledger data");
        }
        ledgerData.unit_model_id = unitModelResult.data.id;
        ledgerData.alt_id = v7();
        await createLedger(ledgerData);
        const missingNameLedger = ledgerFactory.make(1)[0];
        if (!missingNameLedger) {
            throw new Error("Failed to create Ledger data for missing name test");
        }
        missingNameLedger.unit_model_id = unitModelResult.data.id;
        missingNameLedger.name = "";
        const missingNameLedgerResult = await createLedger(missingNameLedger);
        expect(missingNameLedgerResult.success).toBe(false);
        expect(missingNameLedgerResult.success === false && missingNameLedgerResult.errors?.some((e) => e.type === "structure")).toBe(true);
        const duplicateIdsLedger = ledgerFactory.make(1)[0];
        if (!duplicateIdsLedger) {
            throw new Error("Failed to create Ledger data for duplicate IDs test");
        }
        duplicateIdsLedger.unit_model_id = unitModelResult.data.id;
        duplicateIdsLedger.ref_id = ledgerData.ref_id;
        duplicateIdsLedger.alt_id = ledgerData.alt_id;
        const duplicateIdsResult = await createLedger(duplicateIdsLedger);
        expect(duplicateIdsResult.success).toBe(false);
        expect(duplicateIdsResult.success === false && duplicateIdsResult.errors?.some((e) => e.type === "data")).toBe(true);
    });
    it("Can create a valid account", async () => {
        const unitModelFactory = new UnitModelFactory();
        const unitModelData = unitModelFactory.make(1)[0];
        if (!unitModelData) {
            throw new Error("Failed to create Unit Model data");
        }
        unitModelData.active = true;
        const unitModelResult = await createUnitModel(unitModelData);
        if (unitModelResult.success === false) {
            throw new Error("Failed to create Unit Model");
        }
        const ledgerFactory = new LedgerFactory();
        const ledgerData = ledgerFactory.make(1)[0];
        if (!ledgerData) {
            throw new Error("Failed to create Ledger data");
        }
        ledgerData.unit_model_id = unitModelResult.data.id;
        ledgerData.alt_id = v7();
        const ledgerResult = await createLedger(ledgerData);
        if (ledgerResult.success === false) {
            throw new Error("Failed to create Ledger");
        }
        const accountFactory = new AccountFactory();
        const accountData = accountFactory.make(1)[0];
        if (!accountData) {
            throw new Error("Failed to create Account data");
        }
        accountData.ledger_id = ledgerResult.data.id;
        accountData.parent_id = null;
        const accountResult = await createAccount(accountData);
        expect(accountResult.success).toBe(true);
        const missingNameAccount = accountFactory.make(1)[0];
        if (!missingNameAccount) {
            throw new Error("Failed to create Account data for missing name test");
        }
        missingNameAccount.ledger_id = ledgerResult.data.id;
        missingNameAccount.name = "";
        const missingNameAccountResult = await createAccount(missingNameAccount);
        expect(missingNameAccountResult.success).toBe(false);
        expect(missingNameAccountResult.success === false && missingNameAccountResult.errors?.some((e) => e.type === "structure")).toBe(true);
        const duplicateIdsAccount = accountFactory.make(1)[0];
        if (!duplicateIdsAccount) {
            throw new Error("Failed to create Account data for duplicate IDs test");
        }
        duplicateIdsAccount.ledger_id = ledgerResult.data.id;
        duplicateIdsAccount.ref_id = accountData.ref_id;
        duplicateIdsAccount.alt_id = accountData.alt_id;
        const duplicateIdsResult = await createAccount(duplicateIdsAccount);
        expect(duplicateIdsResult.success).toBe(false);
        expect(duplicateIdsResult.success === false && duplicateIdsResult.errors?.some((e) => e.type === "data")).toBe(true);
    });
});
