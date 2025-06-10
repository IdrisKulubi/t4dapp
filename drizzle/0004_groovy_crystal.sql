CREATE TYPE "public"."user_role" AS ENUM('applicant', 'admin', 'technical_reviewer', 'jury_member', 'dragons_den_judge');--> statement-breakpoint
ALTER TYPE "public"."application_status" ADD VALUE 'shortlisted' BEFORE 'approved';--> statement-breakpoint
ALTER TYPE "public"."application_status" ADD VALUE 'scoring_phase' BEFORE 'approved';--> statement-breakpoint
ALTER TYPE "public"."application_status" ADD VALUE 'dragons_den' BEFORE 'approved';--> statement-breakpoint
ALTER TYPE "public"."application_status" ADD VALUE 'finalist' BEFORE 'approved';--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'applicant' NOT NULL,
	"profile_image" text,
	"phone_number" varchar(20),
	"country" varchar(100),
	"organization" varchar(200),
	"bio" text,
	"is_completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_profiles_user_id_idx" ON "user_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_profiles_email_idx" ON "user_profiles" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_profiles_role_idx" ON "user_profiles" USING btree ("role");--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;