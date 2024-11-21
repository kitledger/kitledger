DO $$ BEGIN
 CREATE TYPE "public"."balance_type" AS ENUM('debit', 'credit');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"balance_type" "balance_type",
	"ledger_id" uuid NOT NULL,
	"parent_id" uuid,
	"name" varchar(255) NOT NULL,
	"meta" jsonb,
	"active" boolean DEFAULT true,
	CONSTRAINT "accounts_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "accounts_alt_id_unique" UNIQUE("alt_id"),
	CONSTRAINT "accounts_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversion_rates" (
	"id" uuid PRIMARY KEY NOT NULL,
	"from_uom_id" uuid NOT NULL,
	"to_uom_id" uuid NOT NULL,
	"rate" numeric(24, 8) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dimensions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"entry_id" uuid NOT NULL,
	"entity_model_id" uuid,
	"entity_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entities" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"entity_model_id" uuid NOT NULL,
	"parent_id" uuid,
	"name" varchar(255) NOT NULL,
	"meta" jsonb,
	CONSTRAINT "entities_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "entities_alt_id_unique" UNIQUE("alt_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_models" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"name" varchar(255) NOT NULL,
	CONSTRAINT "entity_models_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "entity_models_alt_id_unique" UNIQUE("alt_id"),
	CONSTRAINT "entity_models_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"ledger_id" uuid NOT NULL,
	"debit_account_id" uuid NOT NULL,
	"credit_account_id" uuid NOT NULL,
	"uom_id" uuid NOT NULL,
	"value" numeric(64, 16) DEFAULT '0',
	"transaction_id" uuid NOT NULL,
	CONSTRAINT "entries_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "entries_alt_id_unique" UNIQUE("alt_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ledgers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"name" varchar(255) NOT NULL,
	"description" text,
	"uom_type_id" uuid,
	"active" boolean DEFAULT true,
	CONSTRAINT "ledgers_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "ledgers_alt_id_unique" UNIQUE("alt_id"),
	CONSTRAINT "ledgers_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_models" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"name" varchar(255) NOT NULL,
	CONSTRAINT "transaction_models_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "transaction_models_alt_id_unique" UNIQUE("alt_id"),
	CONSTRAINT "transaction_models_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"transaction_model_id" uuid NOT NULL,
	"meta" jsonb,
	"lines" jsonb,
	CONSTRAINT "transactions_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "transactions_alt_id_unique" UNIQUE("alt_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "uom_types" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"name" varchar(255) NOT NULL,
	CONSTRAINT "uom_types_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "uom_types_alt_id_unique" UNIQUE("alt_id"),
	CONSTRAINT "uom_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "uoms" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"uom_type_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"symbol" varchar(20),
	"precision" integer DEFAULT 0,
	"decimal_separator" char(1) NOT NULL,
	"thousands_separator" char(1) NOT NULL,
	"active" boolean DEFAULT true,
	CONSTRAINT "uoms_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "uoms_alt_id_unique" UNIQUE("alt_id"),
	CONSTRAINT "uoms_name_unique" UNIQUE("name"),
	CONSTRAINT "uoms_symbol_unique" UNIQUE("symbol")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_ledger_id_ledgers_id_fk" FOREIGN KEY ("ledger_id") REFERENCES "public"."ledgers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_parent_id_accounts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversion_rates" ADD CONSTRAINT "conversion_rates_from_uom_id_uoms_id_fk" FOREIGN KEY ("from_uom_id") REFERENCES "public"."uoms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversion_rates" ADD CONSTRAINT "conversion_rates_to_uom_id_uoms_id_fk" FOREIGN KEY ("to_uom_id") REFERENCES "public"."uoms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dimensions" ADD CONSTRAINT "dimensions_entry_id_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."entries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dimensions" ADD CONSTRAINT "dimensions_entity_model_id_entity_models_id_fk" FOREIGN KEY ("entity_model_id") REFERENCES "public"."entity_models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dimensions" ADD CONSTRAINT "dimensions_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities" ADD CONSTRAINT "entities_entity_model_id_entity_models_id_fk" FOREIGN KEY ("entity_model_id") REFERENCES "public"."entity_models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities" ADD CONSTRAINT "entities_parent_id_entities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entries" ADD CONSTRAINT "entries_ledger_id_ledgers_id_fk" FOREIGN KEY ("ledger_id") REFERENCES "public"."ledgers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entries" ADD CONSTRAINT "entries_debit_account_id_accounts_id_fk" FOREIGN KEY ("debit_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entries" ADD CONSTRAINT "entries_credit_account_id_accounts_id_fk" FOREIGN KEY ("credit_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entries" ADD CONSTRAINT "entries_uom_id_uoms_id_fk" FOREIGN KEY ("uom_id") REFERENCES "public"."uoms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entries" ADD CONSTRAINT "entries_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_uom_type_id_uom_types_id_fk" FOREIGN KEY ("uom_type_id") REFERENCES "public"."uom_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transaction_model_id_transaction_models_id_fk" FOREIGN KEY ("transaction_model_id") REFERENCES "public"."transaction_models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "uoms" ADD CONSTRAINT "uoms_uom_type_id_uom_types_id_fk" FOREIGN KEY ("uom_type_id") REFERENCES "public"."uom_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accounts_balance_type_index" ON "accounts" USING btree ("balance_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accounts_name_index" ON "accounts" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accounts_ref_id_index" ON "accounts" USING btree ("ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accounts_alt_id_index" ON "accounts" USING btree ("alt_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dimensions_entry_id_index" ON "dimensions" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dimensions_entity_model_id_index" ON "dimensions" USING btree ("entity_model_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dimensions_entity_id_index" ON "dimensions" USING btree ("entity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "entities_ref_id_index" ON "entities" USING btree ("ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "entities_alt_id_index" ON "entities" USING btree ("alt_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "entities_name_index" ON "entities" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "entity_models_ref_id_index" ON "entity_models" USING btree ("ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "entity_models_alt_id_index" ON "entity_models" USING btree ("alt_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "entity_models_name_index" ON "entity_models" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "entries_ref_id_index" ON "entries" USING btree ("ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "entries_alt_id_index" ON "entries" USING btree ("alt_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ledgers_name_index" ON "ledgers" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ledgers_ref_id_index" ON "ledgers" USING btree ("ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ledgers_alt_id_index" ON "ledgers" USING btree ("alt_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transaction_models_ref_id_index" ON "transaction_models" USING btree ("ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transaction_models_alt_id_index" ON "transaction_models" USING btree ("alt_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transaction_models_name_index" ON "transaction_models" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactions_ref_id_index" ON "transactions" USING btree ("ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactions_alt_id_index" ON "transactions" USING btree ("alt_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "uom_types_name_index" ON "uom_types" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "uom_types_ref_id_index" ON "uom_types" USING btree ("ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "uom_types_alt_id_index" ON "uom_types" USING btree ("alt_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "uoms_ref_id_index" ON "uoms" USING btree ("ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "uoms_alt_id_index" ON "uoms" USING btree ("alt_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "uoms_name_index" ON "uoms" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "uoms_symbol_index" ON "uoms" USING btree ("symbol");