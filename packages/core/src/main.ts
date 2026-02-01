import type { TransactionForm, EntityForm, UnitForm } from "./forms.js";

import { KitledgerDb } from "./db.js";
import { EntityModel } from "./entities.js";
import { Ledger } from "./ledgers.js";
import { TransactionModel } from "./transactions.js";
import { UnitModel } from "./units.js";

/**
 * Type definition for the overall Kitledger configuration.
 *
 * @remarks
 * Includes database instance, entity models, transaction models, unit models,
 * and optional forms for transactions, entities, and units.
 *
 * @returns An object representing the Kitledger configuration.
 */
export interface KitledgerConfig {
	database: KitledgerDb;
	entityForms?: EntityForm<EntityModel>[];
	entityModels: EntityModel[];
	ledgers: Ledger[];
	transactionForms?: TransactionForm<TransactionModel>[];
	transactionModels: TransactionModel[];
	unitForms?: UnitForm<UnitModel>[];
	unitModels: UnitModel[];
}

/**
 * Factory function to define the Kitledger configuration.
 *
 * @param config - The Kitledger configuration object.
 * @returns The provided Kitledger configuration.
 */
export function defineConfig(config: KitledgerConfig) {
	return config;
}
