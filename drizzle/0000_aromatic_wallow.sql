CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	`current_weight` integer NOT NULL,
	`starting_weight` integer NOT NULL,
	`min_reps` integer NOT NULL,
	`max_reps` integer NOT NULL,
	`weight_increment` integer DEFAULT 2.5 NOT NULL,
	`unit` text DEFAULT 'kg' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`exercise_id` integer NOT NULL,
	`performed_reps` integer NOT NULL,
	`weight_used` integer NOT NULL,
	`difficulty` text NOT NULL,
	`notes` text,
	`logged_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
