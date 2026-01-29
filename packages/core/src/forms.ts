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
    required?: boolean;
    display?: FormFieldDisplay;
};

// DX MAGIC: This provides autocomplete for Model fields
type InferFieldConfig<TFields extends readonly Field[]> = {
    [K in TFields[number] as K["refId"]]?: FormFieldConfig;
};

// --- FORM DEFINITIONS ---

export interface BaseForm {
    refId: string;
    modelRefId: string;
    name: string;
    label?: string;
    description?: string;
    fieldOrder?: string[];
}

export type DefineFormConfig<TModel extends { fields?: readonly any[] }> = {
    name: string;
    label?: string;
    description?: string;
    refId?: string;
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
    config: DefineFormConfig<TModel>
): TransactionForm<TModel> {
    return {
        refId: config.refId || config.name,
        name: config.name,
        label: config.label,
        description: config.description,
        type: FormType.TRANSACTION,
        modelRefId: model.refId,
        fields: config.fields,
    };
}

export function defineEntityForm<const TModel extends EntityModel>(
    model: TModel,
    config: DefineFormConfig<TModel>
): EntityForm<TModel> {
    return {
        refId: config.refId || config.name,
        name: config.name,
        label: config.label,
        description: config.description,
        type: FormType.ENTITY,
        modelRefId: model.refId,
        fields: config.fields,
    };
}

export function defineUnitForm<const TModel extends UnitModel>(
    model: TModel,
    config: DefineFormConfig<TModel>
): UnitForm<TModel> {
    return {
        refId: config.refId || config.name,
        name: config.name,
        label: config.label,
        description: config.description,
        type: FormType.UNIT,
        modelRefId: model.refId,
        fields: config.fields,
    };
}