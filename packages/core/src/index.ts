import { EntityModel } from "./entities.js";
import { TransactionModel } from "./transactions.js";

export interface KitledgerConfig {
	transactionModels: TransactionModel[];
	entityModels: EntityModel[];
}

export function defineConfig(config: KitledgerConfig) {
	return config;
}
