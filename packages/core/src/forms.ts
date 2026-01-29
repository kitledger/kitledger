import type { EntityModel } from "./entities.js";
import type { Field } from "./fields.js";
import type { TransactionModel } from "./transactions.js";
import type { UnitModel } from "./units.js";

// --- CORE TYPES ---

export enum FormType {
	ENTITY = "ENTITY",
	TRANSACTION = "TRANSACTION",
	UNIT = "UNIT",
}

export type FormFieldDisplay = "normal" | "inline" | "disabled" | "hidden";

export type FormFieldConfig = {
	label?: string;
	description?: string;
	display?: FormFieldDisplay;
};

type InferFieldConfig<TFields extends readonly Field[]> = {
	[K in TFields[number] as K["refId"]]?: FormFieldConfig & {
		required?: K["required"] extends true ? true : boolean;
	};
};

// --- FORM DEFINITIONS ---

export interface BaseForm {
	refId: string;
	modelRefId: string;
	name: string;
	description?: string;
	fieldOrder?: string[];
}

export type EntityFormOptions<TModel extends { fields?: readonly any[] }> = {
	name: string;
	description?: string;
	refId: string;
	fields: InferFieldConfig<NonNullable<TModel["fields"]>>;
};

export type UnitFormOptions<TModel extends { fields?: readonly any[] }> = {
	name: string;
	description?: string;
	refId: string;
	fields: InferFieldConfig<NonNullable<TModel["fields"]>>;
};

export type TransactionFormOptions<TModel extends { fields?: readonly any[] }> = {
	name: string;
	description?: string;
	refId: string;
	fields: InferFieldConfig<NonNullable<TModel["fields"]>>;
};

export interface TransactionForm<TModel extends TransactionModel> extends BaseForm {
	type: FormType.TRANSACTION;
	fields: InferFieldConfig<NonNullable<TModel["fields"]>>;
}

export interface EntityForm<TModel extends EntityModel> extends BaseForm {
	type: FormType.ENTITY;
	fields: InferFieldConfig<NonNullable<TModel["fields"]>>;
}

export interface UnitForm<TModel extends UnitModel> extends BaseForm {
	type: FormType.UNIT;
	fields: InferFieldConfig<NonNullable<TModel["fields"]>>;
}

// --- FACTORIES (Pure Configuration) ---

export function defineTransactionForm<const TModel extends TransactionModel>(
	model: TModel,
	config: TransactionFormOptions<TModel>,
): TransactionForm<TModel> {
	return {
		refId: config.refId,
		name: config.name,
		description: config.description,
		type: FormType.TRANSACTION,
		modelRefId: model.refId,
		fields: config.fields,
	};
}

export function defineEntityForm<const TModel extends EntityModel>(
	model: TModel,
	config: EntityFormOptions<TModel>,
): EntityForm<TModel> {
	return {
		refId: config.refId,
		name: config.name,
		description: config.description,
		type: FormType.ENTITY,
		modelRefId: model.refId,
		fields: config.fields,
	};
}

export function defineUnitForm<const TModel extends UnitModel>(
	model: TModel,
	config: UnitFormOptions<TModel>,
): UnitForm<TModel> {
	return {
		refId: config.refId,
		name: config.name,
		description: config.description,
		type: FormType.UNIT,
		modelRefId: model.refId,
		fields: config.fields,
	};
}
