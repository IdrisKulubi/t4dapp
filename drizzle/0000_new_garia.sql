CREATE TYPE "public"."application_status" AS ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."country" AS ENUM('ghana', 'kenya', 'nigeria', 'rwanda', 'tanzania', 'other');--> statement-breakpoint
CREATE TYPE "public"."customer_segment" AS ENUM('household_individuals', 'micro_small_medium_enterprises', 'institutions', 'corporates', 'government_and_ngos');--> statement-breakpoint
CREATE TYPE "public"."education_level" AS ENUM('primary_school_and_below', 'high_school', 'technical_college', 'undergraduate', 'postgraduate');--> statement-breakpoint
CREATE TYPE "public"."funding_instrument" AS ENUM('debt', 'equity', 'quasi', 'other');--> statement-breakpoint
CREATE TYPE "public"."funding_source" AS ENUM('high_net_worth_individual', 'financial_institutions', 'government_agency', 'local_or_international_ngo', 'other');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TABLE "applicants" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
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
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
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
	"total_score" integer,
	"evaluation_notes" text,
	"evaluated_at" timestamp DEFAULT now() NOT NULL,
	"evaluated_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(100) NOT NULL,
	"name" varchar(100),
	"role" varchar(20) DEFAULT 'applicant' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_funding" ADD CONSTRAINT "business_funding_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_target_customers" ADD CONSTRAINT "business_target_customers_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_applicant_id_applicants_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eligibility_results" ADD CONSTRAINT "eligibility_results_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;