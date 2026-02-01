ALTER TABLE "entity_models" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ledgers" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "transaction_models" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "unit_models" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "entity_models" CASCADE;--> statement-breakpoint
DROP TABLE "ledgers" CASCADE;--> statement-breakpoint
DROP TABLE "transaction_models" CASCADE;--> statement-breakpoint
DROP TABLE "unit_models" CASCADE;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "ledger_id" SET DATA TYPE varchar(64);