CREATE TABLE "hero_items" (
	"id" text PRIMARY KEY NOT NULL,
	"position" integer NOT NULL,
	"kind" text NOT NULL,
	"url" text NOT NULL,
	"alt_text" text,
	"poster_url" text,
	"seconds" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "hero_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"default_seconds" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "hero_items" ADD CONSTRAINT "hero_items_updated_by_admin_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero_settings" ADD CONSTRAINT "hero_settings_updated_by_admin_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hero_items_position_idx" ON "hero_items" USING btree ("position");