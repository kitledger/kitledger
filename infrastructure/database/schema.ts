import {
	AnyPgColumn,
	boolean,
	char,
	index,
	integer,
	jsonb,
	numeric,
	pgEnum,
	pgTable,
	text,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { balance_types } from '../../types/balance.ts';
import { MetaType, TransactionLineType } from './validation.ts';
export const balance_type_pg_enum = pgEnum('balance_type', balance_types);

export const ledgers = pgTable('ledgers', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	name: varchar('name', { length: 255 }).unique().notNull(),
	description: text('description'),
	uom_type_id: uuid('uom_type_id').references(() => uom_types.id),
	active: boolean('active').default(true),
}, (table) => {
	return {
		name_idx: index().on(table.name),
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
	};
});

export const ledger_relations = relations(ledgers, ({ one }) => {
	return {
		uom_type: one(uom_types, {
			fields: [ledgers.uom_type_id],
			references: [uom_types.id],
		}),
	};
});

export const accounts = pgTable('accounts', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	balance_type: balance_type_pg_enum('balance_type'),
	ledger_id: uuid('ledger_id').references(() => ledgers.id).notNull(),
	parent_id: uuid('parent_id').references((): AnyPgColumn => accounts.id),
	name: varchar('name', { length: 255 }).unique().notNull(),
	meta: jsonb('meta').$type<MetaType>(),
	active: boolean('active').default(true),
}, (table) => {
	return {
		balance_type_idx: index().on(table.balance_type),
		name_idx: index().on(table.name),
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
	};
});

export const account_relations = relations(accounts, ({ one, many }) => {
	return {
		ledger: one(ledgers, {
			fields: [accounts.id],
			references: [ledgers.id],
		}),
		parent: one(accounts, {
			fields: [accounts.id],
			references: [accounts.id],
		}),
		children: many(accounts),
	};
});

export const uom_types = pgTable('uom_types', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	name: varchar('name', { length: 255 }).unique().notNull(),
}, (table) => {
	return {
		name_idx: index().on(table.name),
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
	};
});

export const uom_type_relations = relations(uom_types, ({ many }) => {
	return {
		uoms: many(uoms),
	};
});

export const uoms = pgTable('uoms', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	uom_type_id: uuid('uom_type_id').references(() => uom_types.id).notNull(),
	name: varchar('name', { length: 255 }).unique().notNull(),
	symbol: varchar('symbol', { length: 20 }).unique(),
	precision: integer('precision').default(0),
	decimal_separator: char('decimal_separator', { length: 1 }).notNull(),
	thousands_separator: char('thousands_separator', { length: 1 }).notNull(),
	active: boolean('active').default(true),
}, (table) => {
	return {
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
		name_idx: index().on(table.name),
		symbol_idx: index().on(table.symbol),
	};
});

export const uom_relations = relations(uoms, ({ one }) => {
	return {
		uom_type: one(uom_types, {
			fields: [uoms.id],
			references: [uom_types.id],
		}),
	};
});

export const conversion_rates = pgTable('conversion_rates', {
	id: uuid('id').primaryKey(),
	from_uom_id: uuid('from_uom_id').references(() => uoms.id).notNull(),
	to_uom_id: uuid('to_uom_id').references(() => uoms.id).notNull(),
	rate: numeric('rate', { precision: 24, scale: 8 }).notNull(),
});

export const conversion_rate_relations = relations(conversion_rates, ({ one }) => {
	return {
		from_uom: one(uoms, {
			fields: [conversion_rates.from_uom_id],
			references: [uoms.id],
		}),
		to_uom: one(uoms, {
			fields: [conversion_rates.to_uom_id],
			references: [uoms.id],
		}),
	};
});

export const entity_models = pgTable('entity_models', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	prefix: varchar('prefix', { length: 8 }).unique().notNull(),
	name: varchar('name', { length: 255 }).unique().notNull(),
}, (table) => {
	return {
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
		name_idx: index().on(table.name),
	};
});

export const entity_model_relations = relations(entity_models, ({ many }) => {
	return {
		ledgers: many(ledgers),
		entities: many(entities),
		dimensions: many(dimensions),
	};
});

export const entities = pgTable('entities', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	entity_model_id: uuid('entity_model_id').references(() => entity_models.id)
		.notNull(),
	parent_id: uuid('parent_id').references((): AnyPgColumn => entities.id),
	name: varchar('name', { length: 255 }).notNull(),
	meta: jsonb('meta').$type<MetaType>(),
}, (table) => {
	return {
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
		name_idx: index().on(table.name),
	};
});

export const entity_relations = relations(entities, ({ one, many }) => {
	return {
		entity_model: one(entity_models, {
			fields: [entities.id],
			references: [entity_models.id],
		}),
		parent: one(entities, {
			fields: [entities.id],
			references: [entities.id],
		}),
		children: many(entities),
		dimensions: many(dimensions),
	};
});

export const transaction_models = pgTable('transaction_models', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	prefix: varchar('prefix', { length: 8 }).unique().notNull(),
	name: varchar('name', { length: 255 }).notNull().unique(),
}, (table) => {
	return {
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
		name_idx: index().on(table.name),
	};
});

export const transaction_model_relations = relations(
	transaction_models,
	({ many }) => {
		return {
			transactions: many(transactions),
		};
	},
);

export const transactions = pgTable('transactions', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	transaction_model_id: uuid('transaction_model_id').references(() =>
		transaction_models.id
	).notNull(),
	meta: jsonb('meta').$type<MetaType>(),
	lines: jsonb('lines').$type<TransactionLineType>(),
}, (table) => {
	return {
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
	};
});

export const transaction_relations = relations(transactions, ({ one }) => {
	return {
		transaction_model: one(transaction_models, {
			fields: [transactions.id],
			references: [transaction_models.id],
		}),
	};
});

export const entries = pgTable('entries', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	ledger_id: uuid('ledger_id').references(() => ledgers.id).notNull(),
	debit_account_id: uuid('debit_account_id').references(() => accounts.id)
		.notNull(),
	credit_account_id: uuid('credit_account_id').references(() => accounts.id)
		.notNull(),
	uom_id: uuid('uom_id').references(() => uoms.id).notNull(),
	value: numeric('value', { precision: 64, scale: 16 }).default('0'),
	transaction_id: uuid('transaction_id').references(() => transactions.id)
		.notNull(),
}, (table) => {
	return {
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
	};
});

export const entry_relations = relations(entries, ({ one, many }) => {
	return {
		transaction: one(transactions, {
			fields: [entries.id],
			references: [transactions.id],
		}),
		ledger: one(ledgers, {
			fields: [entries.id],
			references: [ledgers.id],
		}),
		debit_account: one(accounts, {
			fields: [entries.id],
			references: [accounts.id],
		}),
		credit_account: one(accounts, {
			fields: [entries.id],
			references: [accounts.id],
		}),
		uom: one(uoms, { fields: [entries.id], references: [uoms.id] }),
		dimensions: many(dimensions),
	};
});

// Pivot table between entries, entity_types and entities
export const dimensions = pgTable('dimensions', {
	id: uuid('id').primaryKey(),
	entry_id: uuid('entry_id').references(() => entries.id).notNull(),
	entity_model_id: uuid('entity_model_id').references(() => entity_models.id),
	entity_id: uuid('entity_id').references(() => entities.id).notNull(),
}, (table) => {
	return {
		entry_id_idx: index().on(table.entry_id),
		entity_model_id_idx: index().on(table.entity_model_id),
		entity_id_idx: index().on(table.entity_id),
	};
});

export const dimension_relations = relations(dimensions, ({ one }) => {
	return {
		entry: one(entries, {
			fields: [dimensions.entry_id],
			references: [entries.id],
		}),
		entity_model: one(entity_models, {
			fields: [dimensions.entity_model_id],
			references: [entity_models.id],
		}),
		entity: one(entities, {
			fields: [dimensions.entity_id],
			references: [entities.id],
		}),
	};
});
