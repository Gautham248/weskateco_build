CREATE TABLE "contact_enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enquiry_id" text NOT NULL,
	"reason" text NOT NULL,
	"reason_label" text NOT NULL,
	"routed_to" text NOT NULL,
	"response_sla" text NOT NULL,
	"answers" jsonb NOT NULL,
	"consent" boolean NOT NULL,
	"meta" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "contact_enquiries_created_at_idx" ON "contact_enquiries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "contact_enquiries_enquiry_id_idx" ON "contact_enquiries" USING btree ("enquiry_id");