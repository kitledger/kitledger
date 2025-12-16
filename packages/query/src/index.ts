import * as v from 'valibot';

// --- Base Filter Schemas ---
const BaseConditionSchema = v.object({
    column: v.string(),
});

/**
 * Schema for parsing array condition values (e.g., 'in', 'not_in' operators)
 */
const ArrayValueConditionSchema = v.intersect([
    BaseConditionSchema,
    v.object({
        operator: v.union([v.literal('in'), v.literal('not_in')]),
        value: v.array(v.union([v.string(), v.number(), v.boolean()])),
    }),
]);

/**
 * Schema for parsing date condition values (e.g., 'equal', 'gt', 'lt' operators)
 */
const DateValueConditionSchema = v.intersect([
    BaseConditionSchema,
    v.object({
        operator: v.union([ v.literal('equal'), v.literal('not_equal'), v.literal('gt'), v.literal('gtequal'), v.literal('lt'), v.literal('ltequal'), v.literal('empty'), v.literal('not_empty')]),
        value: v.pipe(v.string(), v.isoDateTime())
    }),
]);

/**
 * Schema for parsing numeric condition values (e.g., 'equal', 'gt', 'lt' operators)
 */
const NumericValueConditionSchema = v.intersect([
	BaseConditionSchema,
	v.object({
		operator: v.union([ v.literal('equal'), v.literal('not_equal'), v.literal('gt'), v.literal('gtequal'), v.literal('lt'), v.literal('ltequal'), v.literal('empty'), v.literal('not_empty')]),
		value: v.union([v.number(), v.boolean()]),
	}),
]);

/**
 * Schema for parsing text condition values (e.g., 'equal', 'contains', 'like' operators)
 */
const TextValueConditionSchema = v.intersect([
	BaseConditionSchema,
	v.object({
		operator: v.union([ v.literal('equal'), v.literal('not_equal'), v.literal('contains'), v.literal('empty'), v.literal('like'), v.literal('not_empty'), v.literal('starts_with'), v.literal('ends_with')]),
		value: v.union([v.string(), v.boolean()]),
	}),
]);

/**
 * Schema for parsing any condition value
 */
export const ConditionSchema = v.union([
    ArrayValueConditionSchema,
    DateValueConditionSchema,
    NumericValueConditionSchema,
	TextValueConditionSchema,
]);

/**
 * Recursive Schema for parsing a group of conditions combined with a logical connector ('and'/'or')
 */
export const ConditionGroupSchema: v.GenericSchema<ConditionGroup> = v.lazy(() =>
    v.object({
        connector: v.union([v.literal('and'), v.literal('or')]),
        conditions: v.array(v.union([ConditionSchema, ConditionGroupSchema])),
    })
);

/**
 * Schema for a simplified recursive query, assuming conventions:
 * - The parent record's primary key is 'id'.
 * - The child record's foreign key is 'parent_id'.
 */
export const RecursiveQuerySchema = v.object({
  // 'ancestors' walks up the tree from child to parent; 'descendants' walks down.
  direction: v.union([v.literal('ancestors'), v.literal('descendants')]),
  // A standard filter to define the starting point of the recursion.
  startWith: ConditionGroupSchema,
});

/**
 * Schema for parsing a simple column selection (with optional alias)
 */
export const SimpleColumnSchema = v.object({
    column: v.string(),
    as: v.optional(v.string()),
});

/**
 * Schema for parsing an aggregate column selection (with function, column, and alias)
 */
export const AggregateColumnSchema = v.object({
    func: v.union([ v.literal('sum'), v.literal('avg'), v.literal('count'), v.literal('min'), v.literal('max')]),
    column: v.string(),
    as: v.string(),
});

/**
 * Schema for parsing any column selection (simple or aggregate)
 */
export const ColumnSchema = v.union([
    v.string(),
    AggregateColumnSchema,
    SimpleColumnSchema
]);

/**
 * Schema for parsing a JOIN clause.
 */
export const JoinSchema = v.object({
	type: v.union([
		v.literal('inner'),
		v.literal('left'),
		v.literal('right'),
		v.literal('full_outer'),
	]),
	table: v.string(),
	as: v.optional(v.string()),
	onLeft: v.string(),
	onRight: v.string(),
});

/**
 * Schema for parsing an order by clause (column and direction)
 */
export const OrderSchema = v.object({
    column: v.string(),
    direction: v.union([v.literal('asc'), v.literal('desc')]),
});

/**
 * Schema for parsing a complete query with selections, conditions, ordering, grouping, limits, and offsets
 */
export const QuerySchema = v.object({
    select: v.array(ColumnSchema),
	recursive: v.optional(RecursiveQuerySchema),
	joins: v.optional(v.array(JoinSchema)),
	where: v.array(ConditionGroupSchema),
    orderBy: v.optional(v.array(OrderSchema)),
    groupBy: v.optional(v.array(v.string())),
    limit: v.optional(v.pipe(
		v.number(),
		v.integer(),
		v.minValue(1),
		v.maxValue(1000)
	)),
    offset: v.optional(v.pipe(
		v.number(),
		v.integer(),
		v.minValue(0)
	)),
});

/**
 * Condition Group type (recursive)
 */
export type ConditionGroup = {
    connector: 'and' | 'or';
    conditions: (v.InferOutput<typeof ConditionSchema> | ConditionGroup)[];
};

/**
 * Condition type inferred from ConditionSchema
 */
export type Condition = v.InferInput<typeof ConditionSchema>;

/**
 * Column type inferred from ColumnSchema
 */
export type Column = v.InferInput<typeof ColumnSchema>;

/**
 * Join type inferred from JoinSchema
 */
export type Join = v.InferInput<typeof JoinSchema>;

/**
 * Order type inferred from OrderSchema
 */
export type Order = v.InferInput<typeof OrderSchema>;

/**
 * Query type inferred from QuerySchema
 */
export type Query = v.InferInput<typeof QuerySchema>;