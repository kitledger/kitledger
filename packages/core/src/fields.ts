export enum FieldType {
	TEXT = "text",
	NUMBER = "number",
	DATE = "date",
	BOOLEAN = "boolean",
	URL = "url",
	SELECT = "select",
	RELATION = "relation",
}

interface BaseField {
	ref_id: string;
	name: string;
	description?: string;
}

export interface TextField extends BaseField {
	type: FieldType.TEXT;
	maxLength?: number;
	format?: "email" | "plain" | "rich_text";
}

export type NumberFormatting =
	| { style: "integer" }
	| { style: "decimal"; precision: number }
	| { style: "currency"; currencyCode: string };

export interface NumberField extends BaseField {
	type: FieldType.NUMBER;
	min?: number;
	max?: number;
	formatting: NumberFormatting;
}

export interface DateField extends BaseField {
	type: FieldType.DATE;
	includeTime: boolean;
	formatStr: string;
}

export interface BooleanField extends BaseField {
	type: FieldType.BOOLEAN;
	defaultValue?: boolean;
}

export interface URLField extends BaseField {
	type: FieldType.URL;
	defaultValue?: string;
}

export type QueryConfig = {};

export interface SelectField extends BaseField {
	type: FieldType.SELECT;
	multiSelect: boolean;
	items: Array<{
		label: string;
		value: string | number;
		color?: string; // Common metadata for tags
	}>;
	defaultValue?: string | number | Array<string | number>;
}

export interface RelationField extends BaseField {
	type: FieldType.RELATION;
	multiSelect: boolean;
	targetEntityId: string;
	displayFieldId: string;
	query: QueryConfig;
}

export type Field = TextField | NumberField | DateField | SelectField | RelationField;

export type TextFieldOptions = Omit<TextField, "type">;
export type NumberFieldOptions = Omit<NumberField, "type">;
export type DateFieldOptions = Omit<DateField, "type">;
export type BooleanFieldOptions = Omit<BooleanField, "type">;
export type URLFieldOptions = Omit<URLField, "type">;
export type SelectFieldOptions = Omit<SelectField, "type">;
export type RelationFieldOptions = Omit<RelationField, "type">;

export function defineTextField(options: TextFieldOptions): TextField {
	return { type: FieldType.TEXT, ...options };
}

export function defineNumberField(options: NumberFieldOptions): NumberField {
	return { type: FieldType.NUMBER, ...options };
}

export function defineDateField(options: DateFieldOptions): DateField {
	return { type: FieldType.DATE, ...options };
}

export function defineBooleanField(options: BooleanFieldOptions): BooleanField {
	return { type: FieldType.BOOLEAN, ...options };
}

export function defineURLField(options: URLFieldOptions): URLField {
	return { type: FieldType.URL, ...options };
}

export function defineSelectField(options: SelectFieldOptions): SelectField {
	return { type: FieldType.SELECT, ...options };
}

export function defineRelationField(options: RelationFieldOptions): RelationField {
	return { type: FieldType.RELATION, ...options };
}