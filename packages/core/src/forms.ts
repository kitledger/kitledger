import type { EntityModel } from "./entities.js";
import type { Field } from "./fields.js";
import type { TransactionModel } from "./transactions.js";
import type { UnitModel } from "./units.js";

// --- CORE TYPES ---

/**
 * The type of form being defined.
 */
export enum FormType {
	ENTITY = "ENTITY",
	TRANSACTION = "TRANSACTION",
	UNIT = "UNIT",
}

/**
 * How a form field is displayed.
 */
export type FormFieldDisplay = "normal" | "inline" | "disabled" | "hidden";

/**
 * Configuration options for a form field.
 */
export type FormFieldConfig = {
	label?: string;
	description?: string;
	display?: FormFieldDisplay;
};

/**
 * Infers the form field configuration from a list of fields.
 */
type InferFieldConfig<TFields extends readonly Field[]> = {
	[K in TFields[number] as K["refId"]]?: FormFieldConfig & {
		required?: K["required"] extends true ? true : boolean;
	};
};

// --- FORM DEFINITIONS ---

/**
 * Base interface for all forms.
 */
export interface BaseForm {
	refId: string;
	modelRefId: string;
	name: string;
	description?: string;
	fieldOrder?: string[];
}

/**
 * Configuration options for entity forms
 */
export type EntityFormOptions<TModel extends { fields?: readonly any[] }> = {
	name: string;
	description?: string;
	refId: string;
	fields: InferFieldConfig<NonNullable<TModel["fields"]>>;
};

/**
 * Configuration options for unit forms
 */
export type UnitFormOptions<TModel extends { fields?: readonly any[] }> = {
	name: string;
	description?: string;
	refId: string;
	fields: InferFieldConfig<NonNullable<TModel["fields"]>>;
};

/**
 * Configuration options for transaction forms
 */
export type TransactionFormOptions<TModel extends { fields?: readonly any[] }> = {
	name: string;
	description?: string;
	refId: string;
	fields: InferFieldConfig<NonNullable<TModel["fields"]>>;
};

/**
 * Form definition for transactions.
 */
export interface TransactionForm<TModel extends TransactionModel> extends BaseForm {
	type: FormType.TRANSACTION;
	fields: InferFieldConfig<NonNullable<TModel["fields"]>>;
}

/**
 * Form definition for entities.
 */
export interface EntityForm<TModel extends EntityModel> extends BaseForm {
	type: FormType.ENTITY;
	fields: InferFieldConfig<NonNullable<TModel["fields"]>>;
}

/**
 * Form definition for units.
 */
export interface UnitForm<TModel extends UnitModel> extends BaseForm {
	type: FormType.UNIT;
	fields: InferFieldConfig<NonNullable<TModel["fields"]>>;
}

// --- FACTORIES (Pure Configuration) ---

/**
 * Factory function to define a transaction form.
 *
 * @remarks
 * This is a pure configuration function that helps create a transaction form
 *
 * @param model The transaction model the form is based on
 * @param config The configuration options for the form
 * @returns A transaction form definition
 */
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

/**
 * Factory function to define an entity form.
 *
 * @remarks
 * This is a pure configuration function that helps create an entity form
 *
 * @param model The entity model the form is based on
 * @param config The configuration options for the form
 * @returns An entity form definition
 */
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

/**
 * Factory function to define a unit form.
 *
 * @remarks
 * This is a pure configuration function that helps create a unit form
 *
 * @param model The unit model the form is based on
 * @param config The configuration options for the form
 * @returns A unit form definition
 */
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
