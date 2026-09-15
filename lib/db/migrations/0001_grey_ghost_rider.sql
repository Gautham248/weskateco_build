CREATE TABLE "newly_released_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"position" integer NOT NULL,
	"product_handle" text NOT NULL,
	"shopify_product_id" text,
	"card_image_url" text,
	"hero_image_url" text,
	"subtitle" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" uuid,
	CONSTRAINT "newly_released_items_product_handle_unique" UNIQUE("product_handle")
);
--> statement-breakpoint
ALTER TABLE "newly_released_items" ADD CONSTRAINT "newly_released_items_updated_by_admin_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "newly_released_items_position_idx" ON "newly_released_items" USING btree ("position");