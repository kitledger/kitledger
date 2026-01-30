import type { Field } from "./fields.js";

/**
 * Enumeration for the status of an entity model.
 */
export enum EntityModelStatus {
	ACTIVE,
	INACTIVE,
}

/**
 * Infers the meta type of an entity based on its fields.
 * 
 * @param TFields - An array of Field definitions.
 * @returns A mapped type where each field's refId is the key and its value type is the value.
 */
export type InferEntityMetaType<TFields extends readonly Field[]> = {
	[K in TFields[number] as K["refId"]]: K["__valueType"];
};

/**
 * Type definition for an entity in the system.
 * 
 * @param TData - The type of the data contained within the entity.
 * @returns An object representing the entity with its metadata and data.
 */
export type Entity<TData = Record<string, any>> = {
	id: string;
	modelRefId: string;
	createdAt: Date;
	updatedAt: Date;
	data: TData;
};

/**
 * Type definition for a hook function that operates on an entity.
 * 
 * @param TData - The type of the data contained within the entity.
 * @returns A promise that resolves to the modified entity.
 */
export type EntityHook<TData> = (entity: Entity<TData>) => Promise<Entity<TData>>;

/**
 * Type definition for the hooks associated with an entity.
 * @param TData - The type of the data contained within the entity.
 * @returns An object containing arrays of hook functions for various entity lifecycle events.
 */
export type EntityHooks<TData = Record<string, any>> = {
	creating?: EntityHook<TData>[];
	updating?: EntityHook<TData>[];
	deleting?: EntityHook<TData>[];
	created?: EntityHook<TData>[];
	updated?: EntityHook<TData>[];
	deleted?: EntityHook<TData>[];
};

/**
 * Type definition for an entity model in the system.
 * 
 * @returns An object representing the entity model with its metadata, fields, and hooks.
 */
export type EntityModel = {
	refId: string;
	altId?: string;
	name: string;
	status: EntityModelStatus;
	fields?: Field[];
	hooks?: EntityHooks<any>;
};

/**
 * Options for defining an entity model.
 * 
 * @param TFields - An array of Field definitions.
 * @returns An object containing the options for the entity model.
 */
export type EntityModelOptions<TFields extends readonly Field[]> = {
	refId: string;
	altId?: string;
	name: string;
	status?: EntityModelStatus;
	fields?: TFields;
	hooks?: EntityHooks<InferEntityMetaType<TFields>>;
};


/**
 * Defines an entity model with the provided options.
 * 
 * @remarks
 * This function helps in creating a strongly typed entity model by inferring
 * the types of the fields provided.
 * 
 * @param options The options for defining the entity model.
 * @returns A strongly typed entity model.
 */
export function defineEntityModel<const TFields extends readonly Field[]>(
	options: EntityModelOptions<TFields>,
): EntityModel & { fields: TFields } {
	return {
		...options,
		status: options.status ?? EntityModelStatus.ACTIVE,
		fields: options.fields,
		hooks: options.hooks as unknown as EntityHooks<any>,
	} as EntityModel & { fields: TFields };
}
