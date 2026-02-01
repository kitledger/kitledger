import type { Field } from "./fields.js";

/**
 * Enumeration for the status of a unit model.
 */
export type UnitModelStatus = "ACTIVE" | "INACTIVE";

/**
 * Infers the meta type of a unit based on its fields.
 *
 * @param TFields - An array of Field definitions.
 * @returns A mapped type where each field's refId is the key and its value type is the value.
 */
export type InferUnitMetaType<TFields extends readonly Field[]> = {
	[K in TFields[number] as K["refId"]]: K["__valueType"];
};

/**
 * Type definition for a unit in the system.
 *
 * @param TData - The type of the data contained within the unit.
 * @returns An object representing the unit with its metadata and data.
 */
export type Unit<TData = Record<string, any>> = {
	id: string;
	modelRefId: string;
	createdAt: Date;
	updatedAt: Date;
	data: TData;
};

/**
 * Type definition for a hook function that operates on a unit.
 *
 * @param TData - The type of the data contained within the unit.
 * @returns A promise that resolves to the modified unit.
 */
export type UnitHook<TData> = (unit: Unit<TData>) => Promise<Unit<TData>>;

/**
 * Type definition for the hooks associated with a unit.
 * @param TData - The type of the data contained within the unit.
 * @returns An object containing arrays of hook functions for various unit lifecycle events.
 */
export type UnitHooks<TData = Record<string, any>> = {
	creating?: UnitHook<TData>[];
	updating?: UnitHook<TData>[];
	deleting?: UnitHook<TData>[];
	created?: UnitHook<TData>[];
	updated?: UnitHook<TData>[];
	deleted?: UnitHook<TData>[];
};

/**
 * Type definition for a unit model in the system.
 *
 * @returns An object representing the unit model with its metadata, fields, and hooks.
 */
export type UnitModel = {
	refId: string;
	altId?: string;
	name: string;
	status: UnitModelStatus;
	fields?: Field[];
	hooks?: UnitHooks<any>;
};

/**
 * Options for defining a unit model.
 *
 * @param TFields - An array of Field definitions.
 * @returns An object containing the options for the unit model.
 */
export type UnitModelOptions<TFields extends readonly Field[]> = {
	refId: string;
	altId?: string;
	name: string;
	status?: UnitModelStatus;
	fields?: TFields;
	hooks?: UnitHooks<InferUnitMetaType<TFields>>;
};

/**
 * Defines a unit model with the given options.
 *
 * @remarks
 * Sets default status to ACTIVE if not provided.
 *
 * @param options - The options for defining the unit model.
 * @returns The defined unit model with its fields.
 */
export function defineUnitModel<const TFields extends readonly Field[]>(
	options: UnitModelOptions<TFields>,
): UnitModel & { fields: TFields } {
	return {
		...options,
		status: options.status ?? "ACTIVE",
		fields: options.fields,
		hooks: options.hooks as unknown as UnitHooks<any>,
	} as UnitModel & { fields: TFields };
}
