CREATE TABLE "social_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"position" integer NOT NULL,
	"image_url" text NOT NULL,
	"alt_text" text,
	"permalink" text,
	"is_reel" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_updated_by_admin_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "social_posts_position_idx" ON "social_posts" USING btree ("position");