CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "product_override_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"override_id" uuid NOT NULL,
	"url" text NOT NULL,
	"alt_text" text,
	"imagekit_file_id" text,
	"width" integer,
	"height" integer,
	"position" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_overrides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_handle" text NOT NULL,
	"shopify_product_id" text,
	"title" text,
	"description_html" text,
	"gallery_mode" text DEFAULT 'append' NOT NULL,
	"cover_image_url" text,
	"removed_image_urls" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" uuid,
	CONSTRAINT "product_overrides_product_handle_unique" UNIQUE("product_handle")
);
--> statement-breakpoint
ALTER TABLE "product_override_images" ADD CONSTRAINT "product_override_images_override_id_product_overrides_id_fk" FOREIGN KEY ("override_id") REFERENCES "public"."product_overrides"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_overrides" ADD CONSTRAINT "product_overrides_updated_by_admin_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_override_images_override_id_idx" ON "product_override_images" USING btree ("override_id");