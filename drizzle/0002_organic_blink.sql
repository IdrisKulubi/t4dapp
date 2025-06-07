CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "application_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" integer NOT NULL,
	"criteria_id" integer NOT NULL,
	"config_id" integer NOT NULL,
	"score" integer NOT NULL,
	"max_score" integer NOT NULL,
	"level" varchar(100),
	"notes" text,
	"evaluated_by" uuid,
	"evaluated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evaluation_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" integer NOT NULL,
	"previous_config_id" integer,
	"new_config_id" integer NOT NULL,
	"previous_total_score" integer,
	"new_total_score" integer,
	"previous_is_eligible" boolean,
	"new_is_eligible" boolean,
	"change_reason" text,
	"evaluated_by" uuid NOT NULL,
	"evaluated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scoring_configurations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"version" varchar(50) DEFAULT '1.0' NOT NULL,
	"is_active" boolean DEFAULT false,
	"is_default" boolean DEFAULT false,
	"total_max_score" integer DEFAULT 100 NOT NULL,
	"pass_threshold" integer DEFAULT 60 NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scoring_criteria" (
	"id" serial PRIMARY KEY NOT NULL,
	"config_id" integer NOT NULL,
	"category" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"max_points" integer NOT NULL,
	"weightage" numeric(5, 2),
	"scoring_levels" text,
	"evaluation_type" varchar(50) DEFAULT 'manual',
	"sort_order" integer DEFAULT 0,
	"is_required" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'user',
	"emailVerified" timestamp,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_active" timestamp DEFAULT now() NOT NULL,
	"is_online" boolean DEFAULT false,
	"profile_photo" text,
	"phone_number" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "applicants" ALTER COLUMN "citizenship" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "applicants" ALTER COLUMN "country_of_residence" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "businesses" ALTER COLUMN "country" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."country";--> statement-breakpoint
CREATE TYPE "public"."country" AS ENUM('ghana', 'kenya', 'nigeria', 'rwanda', 'tanzania');--> statement-breakpoint
ALTER TABLE "applicants" ALTER COLUMN "citizenship" SET DATA TYPE "public"."country" USING "citizenship"::"public"."country";--> statement-breakpoint
ALTER TABLE "applicants" ALTER COLUMN "country_of_residence" SET DATA TYPE "public"."country" USING "country_of_residence"::"public"."country";--> statement-breakpoint
ALTER TABLE "businesses" ALTER COLUMN "country" SET DATA TYPE "public"."country" USING "country"::"public"."country";--> statement-breakpoint
ALTER TABLE "eligibility_results" ADD COLUMN "scoring_config_id" integer;--> statement-breakpoint
ALTER TABLE "eligibility_results" ADD COLUMN "custom_scores" text;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_scores" ADD CONSTRAINT "application_scores_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_scores" ADD CONSTRAINT "application_scores_criteria_id_scoring_criteria_id_fk" FOREIGN KEY ("criteria_id") REFERENCES "public"."scoring_criteria"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_scores" ADD CONSTRAINT "application_scores_config_id_scoring_configurations_id_fk" FOREIGN KEY ("config_id") REFERENCES "public"."scoring_configurations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_history" ADD CONSTRAINT "evaluation_history_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_history" ADD CONSTRAINT "evaluation_history_new_config_id_scoring_configurations_id_fk" FOREIGN KEY ("new_config_id") REFERENCES "public"."scoring_configurations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scoring_criteria" ADD CONSTRAINT "scoring_criteria_config_id_scoring_configurations_id_fk" FOREIGN KEY ("config_id") REFERENCES "public"."scoring_configurations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_created_at_idx" ON "user" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "user_last_active_idx" ON "user" USING btree ("last_active");