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
	readonly refId: string;
	name: string;
	description?: string;
}

export interface TextField extends BaseField {
	type: FieldType.TEXT;
	readonly __valueType: string;
	maxLength?: number;
	format?: "email" | "plain" | "rich_text";
}

export type NumberFormatting =
	| { style: "integer" }
	| { style: "decimal"; precision: number }
	| { style: "currency"; currencyCode: string };

export interface NumberField extends BaseField {
	type: FieldType.NUMBER;
	readonly __valueType: number;
	min?: number;
	max?: number;
	formatting: NumberFormatting;
}

export interface DateField extends BaseField {
	type: FieldType.DATE;
	readonly __valueType: Date;
	includeTime: boolean;
	formatStr: string;
}

export interface BooleanField extends BaseField {
	type: FieldType.BOOLEAN;
	readonly __valueType: boolean;
	defaultValue?: boolean;
}

export interface URLField extends BaseField {
	type: FieldType.URL;
	readonly __valueType: string;
	defaultValue?: string;
}

export type QueryConfig = {};

export interface SelectField extends BaseField {
	type: FieldType.SELECT;
	readonly __valueType: string | number | (string | number)[];
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
	readonly __valueType: any;
	multiSelect: boolean;
	targetEntityId: string;
	displayFieldId: string;
	query: QueryConfig;
}

export type Field = TextField | NumberField | DateField | BooleanField | URLField | SelectField | RelationField;

export type TextFieldOptions = Omit<TextField, "type" | "__valueType" | "refId">;
export type NumberFieldOptions = Omit<NumberField, "type" | "__valueType" | "refId">;
export type DateFieldOptions = Omit<DateField, "type" | "__valueType" | "refId">;
export type BooleanFieldOptions = Omit<BooleanField, "type" | "__valueType" | "refId">;
export type URLFieldOptions = Omit<URLField, "type" | "__valueType" | "refId">;
export type SelectFieldOptions = Omit<SelectField, "type" | "__valueType" | "refId">;
export type RelationFieldOptions = Omit<RelationField, "type" | "__valueType" | "refId">;

export function defineTextField<const T extends string>(
	options: TextFieldOptions & { refId: T },
): TextField & { refId: T } {
	return { type: FieldType.TEXT, ...options } as TextField & { refId: T };
}

export function defineNumberField<const T extends string>(
	options: NumberFieldOptions & { refId: T },
): NumberField & { refId: T } {
	return { type: FieldType.NUMBER, ...options } as NumberField & { refId: T };
}

export function defineDateField<const T extends string>(
	options: DateFieldOptions & { refId: T },
): DateField & { refId: T } {
	return { type: FieldType.DATE, ...options } as DateField & { refId: T };
}

export function defineBooleanField<const T extends string>(
	options: BooleanFieldOptions & { refId: T },
): BooleanField & { refId: T } {
	return { type: FieldType.BOOLEAN, ...options } as BooleanField & { refId: T };
}

export function defineURLField<const T extends string>(
	options: URLFieldOptions & { refId: T },
): URLField & { refId: T } {
	return { type: FieldType.URL, ...options } as URLField & { refId: T };
}

export function defineSelectField<const T extends string>(
	options: SelectFieldOptions & { refId: T },
): SelectField & { refId: T } {
	return { type: FieldType.SELECT, ...options } as SelectField & { refId: T };
}

export function defineRelationField<const T extends string>(
	options: RelationFieldOptions & { refId: T },
): RelationField & { refId: T } {
	return { type: FieldType.RELATION, ...options } as RelationField & { refId: T };
}
