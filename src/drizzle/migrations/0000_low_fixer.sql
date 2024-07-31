CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" text,
	"profile_picture" text,
	"error" text,
	"full_profile" jsonb,
	"profile_scraped" boolean DEFAULT false,
	"message_scrape_started" boolean DEFAULT false,
	"message_scrape_completed" boolean DEFAULT false,
	"wordware_started" boolean DEFAULT false,
	"wordware_completed" boolean DEFAULT false,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
