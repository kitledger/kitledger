import type { TransactionForm, EntityForm, UnitForm } from "./forms.js";

import { KitledgerDb } from "./db.js";
import { EntityModel } from "./entities.js";
import { TransactionModel } from "./transactions.js";
import { UnitModel } from "./units.js";

export interface KitledgerConfig {
	database: KitledgerDb;
	entityModels: EntityModel[];
	transactionModels: TransactionModel[];
	unitModels: UnitModel[];
	transactionForms?: TransactionForm<TransactionModel>[];
	entityForms?: EntityForm<EntityModel>[];
	unitForms?: UnitForm<UnitModel>[];
}

export function defineConfig(config: KitledgerConfig) {
	return config;
}
