CREATE TYPE "public"."application_status" AS ENUM('draft', 'submitted', 'under_review', 'shortlisted', 'scoring_phase', 'dragons_den', 'finalist', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."country" AS ENUM('ghana', 'kenya', 'nigeria', 'rwanda', 'tanzania');--> statement-breakpoint
CREATE TYPE "public"."customer_segment" AS ENUM('household_individuals', 'micro_small_medium_enterprises', 'institutions', 'corporates', 'government_and_ngos');--> statement-breakpoint
CREATE TYPE "public"."education_level" AS ENUM('primary_school_and_below', 'high_school', 'technical_college', 'undergraduate', 'postgraduate');--> statement-breakpoint
CREATE TYPE "public"."funding_instrument" AS ENUM('debt', 'equity', 'quasi', 'other');--> statement-breakpoint
CREATE TYPE "public"."funding_source" AS ENUM('high_net_worth_individual', 'financial_institutions', 'government_agency', 'local_or_international_ngo', 'other');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('applicant', 'admin', 'technical_reviewer', 'jury_member', 'dragons_den_judge');--> statement-breakpoint
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
CREATE TABLE "applicants" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"gender" "gender" NOT NULL,
	"date_of_birth" date NOT NULL,
	"citizenship" "country" NOT NULL,
	"citizenship_other" varchar(100),
	"country_of_residence" "country" NOT NULL,
	"residence_other" varchar(100),
	"phone_number" varchar(20) NOT NULL,
	"email" varchar(100) NOT NULL,
	"highest_education" "education_level" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "applicants_user_id_unique" UNIQUE("user_id")
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
	"evaluated_by" text,
	"evaluated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"business_id" integer NOT NULL,
	"status" "application_status" DEFAULT 'draft' NOT NULL,
	"referral_source" varchar(100),
	"referral_source_other" varchar(100),
	"submitted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_funding" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" integer NOT NULL,
	"has_external_funding" boolean NOT NULL,
	"funding_source" "funding_source",
	"funding_source_other" varchar(100),
	"funding_date" date,
	"funder_name" varchar(200),
	"amount_usd" numeric(12, 2),
	"funding_instrument" "funding_instrument",
	"funding_instrument_other" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_target_customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" integer NOT NULL,
	"customer_segment" "customer_segment" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "businesses" (
	"id" serial PRIMARY KEY NOT NULL,
	"applicant_id" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"start_date" date NOT NULL,
	"is_registered" boolean NOT NULL,
	"registration_certificate_url" varchar(500),
	"country" "country" NOT NULL,
	"country_other" varchar(100),
	"city" varchar(100) NOT NULL,
	"registered_countries" text NOT NULL,
	"description" text NOT NULL,
	"problem_solved" text NOT NULL,
	"revenue_last_two_years" numeric(12, 2) NOT NULL,
	"full_time_employees_total" integer NOT NULL,
	"full_time_employees_male" integer NOT NULL,
	"full_time_employees_female" integer NOT NULL,
	"part_time_employees_male" integer NOT NULL,
	"part_time_employees_female" integer NOT NULL,
	"climate_adaptation_contribution" text NOT NULL,
	"product_service_description" text NOT NULL,
	"climate_extreme_impact" text NOT NULL,
	"unit_price" numeric(12, 2) NOT NULL,
	"customer_count_last_six_months" integer NOT NULL,
	"production_capacity_last_six_months" varchar(200) NOT NULL,
	"current_challenges" text NOT NULL,
	"support_needed" text NOT NULL,
	"additional_information" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eligibility_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" integer NOT NULL,
	"scoring_config_id" integer,
	"is_eligible" boolean NOT NULL,
	"age_eligible" boolean NOT NULL,
	"registration_eligible" boolean NOT NULL,
	"revenue_eligible" boolean NOT NULL,
	"business_plan_eligible" boolean NOT NULL,
	"impact_eligible" boolean NOT NULL,
	"market_potential_score" integer,
	"innovation_score" integer,
	"climate_adaptation_score" integer,
	"job_creation_score" integer,
	"viability_score" integer,
	"management_capacity_score" integer,
	"location_bonus" integer,
	"gender_bonus" integer,
	"custom_scores" text,
	"total_score" integer,
	"evaluation_notes" text,
	"evaluated_at" timestamp DEFAULT now() NOT NULL,
	"evaluated_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "eligibility_results_application_id_unique" UNIQUE("application_id")
);
--> statement-breakpoint
CREATE TABLE "email_verification_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_used" boolean DEFAULT false,
	"attempts" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
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
	"evaluated_by" text NOT NULL,
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
	"created_by" text NOT NULL,
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
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text,
	"role" text DEFAULT 'user',
	"emailVerified" timestamp,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_active" timestamp DEFAULT now() NOT NULL,
	"is_online" boolean DEFAULT false,
	"profile_photo" text,
	"phone_number" text,
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
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_scores" ADD CONSTRAINT "application_scores_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_scores" ADD CONSTRAINT "application_scores_criteria_id_scoring_criteria_id_fk" FOREIGN KEY ("criteria_id") REFERENCES "public"."scoring_criteria"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_scores" ADD CONSTRAINT "application_scores_config_id_scoring_configurations_id_fk" FOREIGN KEY ("config_id") REFERENCES "public"."scoring_configurations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_funding" ADD CONSTRAINT "business_funding_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_target_customers" ADD CONSTRAINT "business_target_customers_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_applicant_id_applicants_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eligibility_results" ADD CONSTRAINT "eligibility_results_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_history" ADD CONSTRAINT "evaluation_history_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_history" ADD CONSTRAINT "evaluation_history_new_config_id_scoring_configurations_id_fk" FOREIGN KEY ("new_config_id") REFERENCES "public"."scoring_configurations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scoring_criteria" ADD CONSTRAINT "scoring_criteria_config_id_scoring_configurations_id_fk" FOREIGN KEY ("config_id") REFERENCES "public"."scoring_configurations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_verification_codes_email_idx" ON "email_verification_codes" USING btree ("email");--> statement-breakpoint
CREATE INDEX "email_verification_codes_code_idx" ON "email_verification_codes" USING btree ("code");--> statement-breakpoint
CREATE INDEX "email_verification_codes_expires_at_idx" ON "email_verification_codes" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "user_profiles_user_id_idx" ON "user_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_profiles_email_idx" ON "user_profiles" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_profiles_role_idx" ON "user_profiles" USING btree ("role");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_created_at_idx" ON "user" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "user_last_active_idx" ON "user" USING btree ("last_active");