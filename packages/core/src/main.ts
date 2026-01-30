import type { TransactionForm, EntityForm, UnitForm } from "./forms.js";

import { KitledgerDb } from "./db.js";
import { EntityModel } from "./entities.js";
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
	entityModels: EntityModel[];
	transactionModels: TransactionModel[];
	unitModels: UnitModel[];
	transactionForms?: TransactionForm<TransactionModel>[];
	entityForms?: EntityForm<EntityModel>[];
	unitForms?: UnitForm<UnitModel>[];
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
