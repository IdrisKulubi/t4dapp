ALTER TABLE "applicants" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "application_scores" ALTER COLUMN "evaluated_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "eligibility_results" ALTER COLUMN "evaluated_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "evaluation_history" ALTER COLUMN "evaluated_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "scoring_configurations" ALTER COLUMN "created_by" SET DATA TYPE text;