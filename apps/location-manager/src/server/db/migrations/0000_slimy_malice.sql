CREATE TABLE `locations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`country` text NOT NULL,
	`status` text NOT NULL,
	`date_added` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`is_favorite` integer DEFAULT false NOT NULL
);
