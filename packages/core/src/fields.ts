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
	options?: {
		maxLength?: number;
		format?: "email" | "plain" | "rich_text";
	};
}

export type NumberFormatting =
	| { style: "integer" }
	| { style: "decimal"; precision: number }
	| { style: "currency"; currencyCode: string };

export interface NumberField extends BaseField {
	type: FieldType.NUMBER;
	options: {
		min?: number;
		max?: number;
		formatting: NumberFormatting;
	};
}

export interface DateField extends BaseField {
	type: FieldType.DATE;
	options?: {
		includeTime: boolean;
		formatStr: string;
	};
}

export type QueryConfig = {};

export interface SelectField extends BaseField {
	type: FieldType.SELECT;
	options: {
		multiSelect: boolean;
		items: Array<{
			label: string;
			value: string | number;
			color?: string; // Common metadata for tags
		}>;
		defaultValue?: string | number | Array<string | number>;
	};
}

export interface RelationField extends BaseField {
	type: FieldType.RELATION;
	options: {
		multiSelect: boolean;
		targetEntityId: string;
		displayFieldId: string;
		query: QueryConfig;
	};
}

export type Field = TextField | NumberField | DateField | SelectField | RelationField;

export type FieldOptions = Field;

export function defineField<T extends FieldOptions>(options: T): T {
	return options;
}
