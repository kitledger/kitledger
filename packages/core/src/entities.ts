import type { Field } from "./fields.js";

export enum EntityModelStatus {
	ACTIVE,
	INACTIVE,
}

export type InferEntityMetaType<TFields extends readonly Field[]> = {
	[K in TFields[number] as K["refId"]]: K["__valueType"];
};

export type Entity<TData = Record<string, any>> = {
	id: string;
	modelRefId: string;
	createdAt: Date;
	updatedAt: Date;
	data: TData;
};

export type EntityHook<TData> = (entity: Entity<TData>) => Promise<Entity<TData>>;
export type EntityHooks<TData = Record<string, any>> = {
	creating?: EntityHook<TData>[];
	updating?: EntityHook<TData>[];
	deleting?: EntityHook<TData>[];
	created?: EntityHook<TData>[];
	updated?: EntityHook<TData>[];
	deleted?: EntityHook<TData>[];
};

export type EntityModel = {
	refId: string;
	altId?: string;
	name: string;
	status: EntityModelStatus;
	fields?: Field[];
	hooks?: EntityHooks<any>;
};

export type EntityModelOptions<TFields extends readonly Field[]> = {
	refId: string;
	altId?: string;
	name: string;
	status?: EntityModelStatus;
	fields?: TFields;
	hooks?: EntityHooks<InferEntityMetaType<TFields>>;
};

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
