import { KitledgerDb } from "./db.js";
import { EntityModel } from "./entities.js";
import { TransactionModel } from "./transactions.js";

export interface KitledgerConfig {
	database: KitledgerDb;
	entityModels: EntityModel[];
	transactionModels: TransactionModel[];
}

export function defineConfig(config: KitledgerConfig) {
	return config;
}
