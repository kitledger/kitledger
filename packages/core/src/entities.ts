import type { Field } from "./fields.js";

export enum EntityModelStatus {
	ACTIVE,
	INACTIVE,
}

export type InferEntityMetaType<TFields extends readonly Field[]> = {
	[K in TFields[number] as K["ref_id"]]: K["__primitive_type"];
};

export type Entity<TData = Record<string, any>> = {
	id: string;
	model_ref_id: string;
	created_at: Date;
	updated_at: Date;
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
	ref_id: string;
	alt_id?: string;
	name: string;
	status: EntityModelStatus;
	fields?: Field[];
	hooks?: EntityHooks<any>;
};

export type EntityModelOptions<TFields extends readonly Field[]> = {
	ref_id: string;
	alt_id?: string;
	name: string;
	status?: EntityModelStatus;
	fields?: TFields;
	hooks?: EntityHooks<InferEntityMetaType<TFields>>;
};

export function defineEntityModel<const TFields extends readonly Field[]>(
	options: EntityModelOptions<TFields>,
): EntityModel {
	const entityModel: EntityModel = {
		...options,
		status: options.status ?? EntityModelStatus.ACTIVE,
		fields: options.fields as unknown as Field[],
		hooks: options.hooks as unknown as EntityHooks<any>,
	};
	return entityModel;
}
