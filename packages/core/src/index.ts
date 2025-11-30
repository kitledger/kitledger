import { TransactionModel } from "./transactions.js"
import { EntityModel } from "./entities.js"

export interface KitledgerConfig {
	transactionModels: TransactionModel[],
	entityModels: EntityModel[]
}

export function defineConfig(config: KitledgerConfig) {
	return config
}