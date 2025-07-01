ALTER TYPE "public"."customer_segment" ADD VALUE 'other';--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "customer_segments_other" text;