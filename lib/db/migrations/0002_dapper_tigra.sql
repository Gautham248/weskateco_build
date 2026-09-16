CREATE TABLE "shop_now_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"position" integer NOT NULL,
	"product_handle" text NOT NULL,
	"shopify_product_id" text,
	"image_url_1" text,
	"image_url_2" text,
	"image_url_3" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" uuid,
	CONSTRAINT "shop_now_items_product_handle_unique" UNIQUE("product_handle")
);
--> statement-breakpoint
ALTER TABLE "shop_now_items" ADD CONSTRAINT "shop_now_items_updated_by_admin_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "shop_now_items_position_idx" ON "shop_now_items" USING btree ("position");