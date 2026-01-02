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
	readonly ref_id: string;
	name: string;
	description?: string;
}

export interface TextField extends BaseField {
	type: FieldType.TEXT;
	readonly __primitive_type?: string;
	maxLength?: number;
	format?: "email" | "plain" | "rich_text";
}

export type NumberFormatting =
	| { style: "integer" }
	| { style: "decimal"; precision: number }
	| { style: "currency"; currencyCode: string };

export interface NumberField extends BaseField {
	type: FieldType.NUMBER;
	readonly __primitive_type?: number;
	min?: number;
	max?: number;
	formatting: NumberFormatting;
}

export interface DateField extends BaseField {
	type: FieldType.DATE;
	readonly __primitive_type?: Date;
	includeTime: boolean;
	formatStr: string;
}

export interface BooleanField extends BaseField {
	type: FieldType.BOOLEAN;
	readonly __primitive_type?: boolean;
	defaultValue?: boolean;
}

export interface URLField extends BaseField {
	type: FieldType.URL;
	readonly __primitive_type?: string;
	defaultValue?: string;
}

export type QueryConfig = {};

export interface SelectField extends BaseField {
	type: FieldType.SELECT;
	readonly __primitive_type?: string | number | (string | number)[];
	multiSelect: boolean;
	items: Array<{
		label: string;
		value: string | number;
		color?: string;
	}>;
	defaultValue?: string | number | Array<string | number>;
}

export interface RelationField extends BaseField {
	type: FieldType.RELATION;
	readonly __primitive_type?: any;
	multiSelect: boolean;
	targetEntityId: string;
	displayFieldId: string;
	query: QueryConfig;
}

export type Field = TextField | NumberField | DateField | BooleanField | URLField | SelectField | RelationField;

export type TextFieldOptions = Omit<TextField, "type" | "__primitive_type" | "ref_id">;
export type NumberFieldOptions = Omit<NumberField, "type" | "__primitive_type" | "ref_id">;
export type DateFieldOptions = Omit<DateField, "type" | "__primitive_type" | "ref_id">;
export type BooleanFieldOptions = Omit<BooleanField, "type" | "__primitive_type" | "ref_id">;
export type URLFieldOptions = Omit<URLField, "type" | "__primitive_type" | "ref_id">;
export type SelectFieldOptions = Omit<SelectField, "type" | "__primitive_type" | "ref_id">;
export type RelationFieldOptions = Omit<RelationField, "type" | "__primitive_type" | "ref_id">;

export function defineTextField<const T extends string>(
	options: TextFieldOptions & { ref_id: T },
): TextField & { ref_id: T } {
	return { type: FieldType.TEXT, ...options } as TextField & { ref_id: T };
}

export function defineNumberField<const T extends string>(
	options: NumberFieldOptions & { ref_id: T },
): NumberField & { ref_id: T } {
	return { type: FieldType.NUMBER, ...options } as NumberField & { ref_id: T };
}

export function defineDateField<const T extends string>(
	options: DateFieldOptions & { ref_id: T },
): DateField & { ref_id: T } {
	return { type: FieldType.DATE, ...options } as DateField & { ref_id: T };
}

export function defineBooleanField<const T extends string>(
	options: BooleanFieldOptions & { ref_id: T },
): BooleanField & { ref_id: T } {
	return { type: FieldType.BOOLEAN, ...options } as BooleanField & { ref_id: T };
}

export function defineURLField<const T extends string>(
	options: URLFieldOptions & { ref_id: T },
): URLField & { ref_id: T } {
	return { type: FieldType.URL, ...options } as URLField & { ref_id: T };
}

export function defineSelectField<const T extends string>(
	options: SelectFieldOptions & { ref_id: T },
): SelectField & { ref_id: T } {
	return { type: FieldType.SELECT, ...options } as SelectField & { ref_id: T };
}

export function defineRelationField<const T extends string>(
	options: RelationFieldOptions & { ref_id: T },
): RelationField & { ref_id: T } {
	return { type: FieldType.RELATION, ...options } as RelationField & { ref_id: T };
}
