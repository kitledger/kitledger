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
	required: boolean;
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

export type TextFieldOptions = Omit<TextField, "type" | "__valueType" | "refId" | "required"> & { required?: boolean };
export type NumberFieldOptions = Omit<NumberField, "type" | "__valueType" | "refId" | "required"> & {
	required?: boolean;
};
export type DateFieldOptions = Omit<DateField, "type" | "__valueType" | "refId" | "required"> & { required?: boolean };
export type BooleanFieldOptions = Omit<BooleanField, "type" | "__valueType" | "refId" | "required"> & {
	required?: boolean;
};
export type URLFieldOptions = Omit<URLField, "type" | "__valueType" | "refId" | "required"> & { required?: boolean };
export type SelectFieldOptions = Omit<SelectField, "type" | "__valueType" | "refId" | "required"> & {
	required?: boolean;
};
export type RelationFieldOptions = Omit<RelationField, "type" | "__valueType" | "refId" | "required"> & {
	required?: boolean;
};

export function defineTextField<const T extends string, const R extends boolean = false>(
	options: TextFieldOptions & { refId: T; required?: R },
): TextField & { refId: T; required: R } {
	const { required = false as R, ...rest } = options;
	return {
		type: FieldType.TEXT,
		required,
		...rest,
	} as TextField & { refId: T; required: R };
}

export function defineNumberField<const T extends string, const R extends boolean = false>(
	options: NumberFieldOptions & { refId: T; required?: R },
): NumberField & { refId: T; required: R } {
	const { required = false as R, ...rest } = options;
	return {
		type: FieldType.NUMBER,
		required,
		...rest,
	} as NumberField & { refId: T; required: R };
}

export function defineDateField<const T extends string, const R extends boolean = false>(
	options: DateFieldOptions & { refId: T; required?: R },
): DateField & { refId: T; required: R } {
	const { required = false as R, ...rest } = options;
	return {
		type: FieldType.DATE,
		required,
		...rest,
	} as DateField & { refId: T; required: R };
}

export function defineBooleanField<const T extends string, const R extends boolean = false>(
	options: BooleanFieldOptions & { refId: T; required?: R },
): BooleanField & { refId: T; required: R } {
	const { required = false as R, ...rest } = options;
	return {
		type: FieldType.BOOLEAN,
		required,
		...rest,
	} as BooleanField & { refId: T; required: R };
}

export function defineURLField<const T extends string, const R extends boolean = false>(
	options: URLFieldOptions & { refId: T; required?: R },
): URLField & { refId: T; required: R } {
	const { required = false as R, ...rest } = options;
	return {
		type: FieldType.URL,
		required,
		...rest,
	} as URLField & { refId: T; required: R };
}

export function defineSelectField<const T extends string, const R extends boolean = false>(
	options: SelectFieldOptions & { refId: T; required?: R },
): SelectField & { refId: T; required: R } {
	const { required = false as R, ...rest } = options;
	return {
		type: FieldType.SELECT,
		required,
		...rest,
	} as SelectField & { refId: T; required: R };
}

export function defineRelationField<const T extends string, const R extends boolean = false>(
	options: RelationFieldOptions & { refId: T; required?: R },
): RelationField & { refId: T; required: R } {
	const { required = false as R, ...rest } = options;
	return {
		type: FieldType.RELATION,
		required,
		...rest,
	} as RelationField & { refId: T; required: R };
}
