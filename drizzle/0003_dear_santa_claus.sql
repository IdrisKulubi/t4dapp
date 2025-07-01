CREATE TYPE "public"."support_category" AS ENUM('technical_issue', 'application_help', 'account_problem', 'payment_issue', 'feature_request', 'bug_report', 'general_inquiry', 'other');--> statement-breakpoint
CREATE TYPE "public"."support_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."support_status" AS ENUM('open', 'in_progress', 'waiting_for_user', 'resolved', 'closed');--> statement-breakpoint
CREATE TABLE "support_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticket_id" integer NOT NULL,
	"responder_id" text NOT NULL,
	"responder_name" varchar(200) NOT NULL,
	"responder_role" varchar(50) NOT NULL,
	"message" text NOT NULL,
	"attachment_url" varchar(500),
	"is_internal" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticket_number" varchar(20) NOT NULL,
	"user_id" text NOT NULL,
	"category" "support_category" NOT NULL,
	"priority" "support_priority" DEFAULT 'medium' NOT NULL,
	"status" "support_status" DEFAULT 'open' NOT NULL,
	"subject" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"user_name" varchar(200) NOT NULL,
	"attachment_url" varchar(500),
	"assigned_to" text,
	"resolved_at" timestamp,
	"resolved_by" text,
	"resolution_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "support_tickets_ticket_number_unique" UNIQUE("ticket_number")
);
--> statement-breakpoint
ALTER TABLE "support_responses" ADD CONSTRAINT "support_responses_ticket_id_support_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_responses" ADD CONSTRAINT "support_responses_responder_id_user_id_fk" FOREIGN KEY ("responder_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assigned_to_user_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_resolved_by_user_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "support_responses_ticket_id_idx" ON "support_responses" USING btree ("ticket_id");--> statement-breakpoint
CREATE INDEX "support_responses_responder_id_idx" ON "support_responses" USING btree ("responder_id");--> statement-breakpoint
CREATE INDEX "support_responses_created_at_idx" ON "support_responses" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "support_tickets_ticket_number_idx" ON "support_tickets" USING btree ("ticket_number");--> statement-breakpoint
CREATE INDEX "support_tickets_user_id_idx" ON "support_tickets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "support_tickets_status_idx" ON "support_tickets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "support_tickets_category_idx" ON "support_tickets" USING btree ("category");--> statement-breakpoint
CREATE INDEX "support_tickets_priority_idx" ON "support_tickets" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "support_tickets_created_at_idx" ON "support_tickets" USING btree ("created_at");