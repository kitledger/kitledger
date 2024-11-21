ALTER TABLE "entity_models" ADD COLUMN "prefix" varchar(8) NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction_models" ADD COLUMN "prefix" varchar(8) NOT NULL;--> statement-breakpoint
ALTER TABLE "entity_models" ADD CONSTRAINT "entity_models_prefix_unique" UNIQUE("prefix");--> statement-breakpoint
ALTER TABLE "transaction_models" ADD CONSTRAINT "transaction_models_prefix_unique" UNIQUE("prefix");